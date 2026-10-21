import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service';
import { ingredients, recipeIngredients, recipes } from '../../database/schema';
import { INGREDIENT_SYNONYMS } from './ingredient-synonyms';

export interface CatalogIngredient {
  name: string;
  recipeCount: number;
}

// exact: nombre del catalogo; synonym: sinonimo regional; family: "queso" abarca "queso seco";
// typo: error de escritura tolerado; none: no esta en el catalogo (regla de negocio b)
export type ResolutionKind = 'exact' | 'synonym' | 'family' | 'typo' | 'none';

export interface IngredientResolution {
  input: string;
  matches: string[];
  via: ResolutionKind;
}

const CACHE_TTL_MS = 60_000;
const FAMILY_LIMIT = 6;

// Minusculas, sin acentos ni signos y con un solo espacio entre palabras
export function normalizeIngredient(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9ñ ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Plurales comunes: "frijoles" -> "frijol", "tomates" -> "tomate"
function variantsOf(key: string): string[] {
  const variants = [key];
  if (key.length > 4 && key.endsWith('es')) variants.push(key.slice(0, -2));
  if (key.length > 3 && key.endsWith('s')) variants.push(key.slice(0, -1));
  return variants;
}

// Errores tolerados segun el largo: palabras cortas deben escribirse bien
function maxTypos(length: number): number {
  if (length <= 4) return 0;
  if (length <= 7) return 1;
  return 2;
}

function levenshtein(a: string, b: string, limit: number): number {
  if (Math.abs(a.length - b.length) > limit) return limit + 1;
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost);
      rowMin = Math.min(rowMin, current[j]);
    }
    if (rowMin > limit) return limit + 1;
    previous = current;
  }
  return previous[b.length];
}

interface CatalogIndex {
  entries: CatalogIngredient[];
  byKey: Map<string, string>;
  synonyms: Map<string, string>;
  loadedAt: number;
}

@Injectable()
export class IngredientCatalogService {
  private index: CatalogIndex | null = null;

  constructor(private readonly databaseService: DatabaseService) {}

  // Ingredientes de recetas publicadas, los mas usados primero
  async listUsed(): Promise<CatalogIngredient[]> {
    const { entries } = await this.getIndex();
    return entries.filter((e) => e.recipeCount > 0);
  }

  async resolve(terms: string[]): Promise<IngredientResolution[]> {
    const index = await this.getIndex();
    return terms.map((term) => this.resolveOne(index, term));
  }

  // Nombres oficiales listos para la busqueda, sin repetir
  async resolveNames(terms: string[]): Promise<string[]> {
    const resolved = await this.resolve(terms);
    return [...new Set(resolved.flatMap((r) => r.matches))];
  }

  private resolveOne(index: CatalogIndex, input: string): IngredientResolution {
    const key = normalizeIngredient(input);
    const none: IngredientResolution = { input, matches: [], via: 'none' };
    if (!key) return none;
    const variants = variantsOf(key);

    for (const v of variants) {
      const name = index.byKey.get(v);
      if (name) return { input, matches: [name], via: 'exact' };
    }

    for (const v of variants) {
      const name = index.synonyms.get(v);
      if (name) return { input, matches: [name], via: 'synonym' };
    }

    for (const v of variants) {
      const family = index.entries
        .filter((e) => normalizeIngredient(e.name).startsWith(`${v} `))
        .slice(0, FAMILY_LIMIT)
        .map((e) => e.name);
      if (family.length > 0) return { input, matches: family, via: 'family' };
    }

    // Solo se acepta la correccion si hay un unico candidato mas cercano
    const limit = maxTypos(key.length);
    if (limit === 0) return none;
    let best = limit + 1;
    let candidates = new Set<string>();
    const consider = (candidateKey: string, name: string): void => {
      const distance = levenshtein(key, candidateKey, limit);
      if (distance < best) {
        best = distance;
        candidates = new Set([name]);
      } else if (distance === best) {
        candidates.add(name);
      }
    };
    index.byKey.forEach((name, k) => consider(k, name));
    index.synonyms.forEach((name, k) => consider(k, name));

    if (best <= limit && candidates.size === 1) {
      return { input, matches: [...candidates], via: 'typo' };
    }
    return none;
  }

  // El catalogo es pequeno: se carga completo y se refresca cada minuto
  private async getIndex(): Promise<CatalogIndex> {
    if (this.index && Date.now() - this.index.loadedAt < CACHE_TTL_MS) return this.index;

    const rows = await this.databaseService.db
      .select({
        name: ingredients.name,
        recipeCount: sql<number>`count(${recipes.id}) filter (where ${recipes.status} = 'PUBLISHED')::int`,
      })
      .from(ingredients)
      .leftJoin(recipeIngredients, eq(recipeIngredients.ingredientId, ingredients.id))
      .leftJoin(recipes, eq(recipes.id, recipeIngredients.recipeId))
      .groupBy(ingredients.id)
      .orderBy(sql`2 desc`, ingredients.name);

    const byKey = new Map(rows.map((r) => [normalizeIngredient(r.name), r.name]));
    // Un sinonimo solo cuenta si su destino existe en el catalogo
    const synonyms = new Map<string, string>();
    for (const [alias, target] of Object.entries(INGREDIENT_SYNONYMS)) {
      const name = byKey.get(normalizeIngredient(target));
      if (name) synonyms.set(normalizeIngredient(alias), name);
    }

    this.index = { entries: rows, byKey, synonyms, loadedAt: Date.now() };
    return this.index;
  }
}
