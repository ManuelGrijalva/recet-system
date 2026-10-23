import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, asc, desc, eq, ilike, inArray, sql } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service';
import {
  ingredients,
  recipeImages,
  recipeIngredients,
  recipes,
  recipeReactions,
  recipeComments,
  recipeBookmarks,
  users,
} from '../../database/schema';
import { CreateRecipeDto, RecipeIngredientInputDto } from './dto/create-recipe.dto';
import { SearchRecipesDto } from './dto/search-recipe.dto';
import { UserRole } from '../../common/decorators/roles.decorator';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { RecipeStepInstruction } from '../../database/schema';
import { MediaService } from '../media/media.service';
import { IngredientCatalogService } from '../ingredients/ingredient-catalog.service';

export interface FeedRecipeItem {
  id: string;
  title: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  coverImageUrl: string | null;
  originRegion: string;
  sourceType: 'REFERENCE' | 'INTERVIEW' | 'COMMUNITY';
  sourceName: string | null;
  sourceUrl: string | null;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'ARCHIVED';
  reviewNotes?: string | null;
  createdAt: Date;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  reactionCounts: {
    like: number;
    yummy: number;
    triedIt: number;
  };
  commentsCount: number;
  matchPercentage?: number;
  matchedIngredientNames?: string[];
  missingIngredientNames?: string[];
}

export interface RecipeDetailItem extends FeedRecipeItem {
  ingredients: { name: string; quantity: string; unit: string; notes: string | null }[];
  // Fotos despues de la portada, en orden
  galleryImageUrls: string[];
  steps: RecipeStepInstruction[];
  userReaction: 'LIKE' | 'YUMMY' | 'TRIED_IT' | null;
  isBookmarked: boolean;
}

@Injectable()
export class RecipesService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mediaService: MediaService,
    private readonly ingredientCatalog: IngredientCatalogService,
  ) {}

  // Rechaza fotos que no salieron de nuestra subida a R2 y ordena portada + galeria
  private resolveImages(dto: CreateRecipeDto): {
    coverImageUrl: string | null | undefined;
    gallery: string[] | undefined;
  } {
    const all = [dto.coverImageUrl, ...(dto.galleryImageUrls ?? [])];
    for (const url of all) {
      if (url && !this.mediaService.isOwnRecipeImage(url)) {
        throw new BadRequestException('Las fotos deben subirse desde el formulario de la receta');
      }
    }
    if (dto.galleryImageUrls === undefined) {
      return { coverImageUrl: dto.coverImageUrl, gallery: undefined };
    }
    // Sin portada, la primera foto de la galeria toma su lugar; se descartan repetidas
    const unique = [...new Set(all.filter((url): url is string => Boolean(url)))];
    return { coverImageUrl: unique[0] ?? null, gallery: unique.slice(1) };
  }

  private async replaceGallery(recipeId: string, urls: string[] | undefined): Promise<void> {
    if (urls === undefined) return;
    const db = this.databaseService.db;
    await db.delete(recipeImages).where(eq(recipeImages.recipeId, recipeId));
    if (urls.length > 0) {
      await db.insert(recipeImages).values(urls.map((url, i) => ({ recipeId, url, position: i + 1 })));
    }
  }

  async create(
    authorId: string,
    authorRole: UserRole,
    dto: CreateRecipeDto,
  ): Promise<FeedRecipeItem> {
    const images = this.resolveImages(dto);
    const db = this.databaseService.db;

    // 1. Insertar receta base
    const [newRecipe] = await db
      .insert(recipes)
      .values({
        authorId,
        title: dto.title,
        description: dto.description,
        prepTimeMinutes: dto.prepTimeMinutes,
        cookTimeMinutes: dto.cookTimeMinutes,
        servings: dto.servings,
        difficulty: dto.difficulty,
        coverImageUrl: images.coverImageUrl,
        status: this.resolveInitialStatus(authorRole, dto.status),
        originRegion: dto.originRegion || 'Jutiapa',
        instructions: dto.instructions,
      })
      .returning();

    await this.attachIngredients(newRecipe.id, dto.ingredients);
    await this.replaceGallery(newRecipe.id, images.gallery);

    return this.getById(newRecipe.id);
  }

  // authorIds limita el feed a ciertos autores (perfil publico o "Siguiendo")
  async getFeed(
    page = 1,
    limit = 10,
    authorIds?: string[],
  ): Promise<{ items: FeedRecipeItem[]; total: number }> {
    const db = this.databaseService.db;
    const offset = (page - 1) * limit;
    if (authorIds && authorIds.length === 0) return { items: [], total: 0 };
    const visible = and(
      eq(recipes.status, 'PUBLISHED'),
      authorIds ? inArray(recipes.authorId, authorIds) : undefined,
    );

    // Consulta optimizada aprovechando el indice compuesto (status, created_at desc)
    const publishedRecipes = await db
      .select({
        recipe: recipes,
        author: {
          id: users.id,
          name: users.name,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(recipes)
      .innerJoin(users, eq(recipes.authorId, users.id))
      .where(visible)
      .orderBy(desc(recipes.createdAt))
      .limit(limit)
      .offset(offset);

    const stats = await this.getStatsFor(publishedRecipes.map((row) => row.recipe.id));
    const items = publishedRecipes.map((row) => toFeedItem(row, stats));

    const [totalRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(recipes)
      .where(visible);

    return { items, total: totalRow ? totalRow.count : 0 };
  }

  /**
   * Busqueda inteligente por ingredientes disponibles (numeral 3.4.2 de Entrega I part2.md)
   * Aplica logica de conjuntos para ordenar por porcentaje de coincidencia.
   */
  async search(dto: SearchRecipesDto): Promise<FeedRecipeItem[]> {
    const db = this.databaseService.db;
    const page = dto.page || 1;
    const limit = dto.limit || 10;
    const offset = (page - 1) * limit;

    if (dto.ingredients && dto.ingredients.trim().length > 0) {
      // Sinonimos, plurales y errores de escritura se traducen al nombre oficial (RR-03)
      const availableList = await this.ingredientCatalog.resolveNames(
        dto.ingredients
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0),
      );

      if (availableList.length > 0) {
        // Obtenemos los id de los ingredientes coincidentes
        const matchedIngs = await db
          .select({ id: ingredients.id })
          .from(ingredients)
          .where(inArray(ingredients.name, availableList));

        const matchedIds = matchedIngs.map((i) => i.id);

        if (matchedIds.length === 0) {
          return [];
        }

        // Consulta de conjuntos: cuenta cuantos ingredientes de la receta coinciden vs total
        const matches = await db
          .select({
            recipeId: recipeIngredients.recipeId,
            matchedCount: sql<number>`count(case when ${inArray(recipeIngredients.ingredientId, matchedIds)} then 1 end)::int`,
            totalCount: sql<number>`count(*)::int`,
          })
          .from(recipeIngredients)
          .groupBy(recipeIngredients.recipeId)
          .having(sql`count(case when ${inArray(recipeIngredients.ingredientId, matchedIds)} then 1 end) > 0`);

        const scoredMap = new Map<string, number>();
        for (const m of matches) {
          const pct = Math.round((m.matchedCount / m.totalCount) * 100);
          scoredMap.set(m.recipeId, pct);
        }

        const recipeIds = Array.from(scoredMap.keys());
        if (recipeIds.length === 0) {
          return [];
        }

        const candidateRecipes = await db
          .select({
            recipe: recipes,
            author: {
              id: users.id,
              name: users.name,
              avatarUrl: users.avatarUrl,
            },
          })
          .from(recipes)
          .innerJoin(users, eq(recipes.authorId, users.id))
          .where(
            and(
              eq(recipes.status, 'PUBLISHED'),
              inArray(recipes.id, recipeIds),
            ),
          );

        // Estadisticas y desglose de todas las candidatas en consultas agrupadas, no receta por receta
        const candidateIds = candidateRecipes.map((cand) => cand.recipe.id);
        const [stats, breakdowns] = await Promise.all([
          this.getStatsFor(candidateIds),
          this.getBreakdownsFor(candidateIds, matchedIds),
        ]);
        const results: FeedRecipeItem[] = candidateRecipes.map((cand) => {
          const breakdown = breakdowns.get(cand.recipe.id);
          return {
            ...toFeedItem(cand, stats),
            matchPercentage: scoredMap.get(cand.recipe.id) || 0,
            matchedIngredientNames: breakdown?.matchedNames ?? [],
            missingIngredientNames: breakdown?.missingNames ?? [],
          };
        });

        // Ordenar descendentemente por coincidencia (Criterio de aceptacion c, Tabla 20)
        results.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
        return results.slice(offset, offset + limit);
      }
    }

    // Busqueda por texto o region
    const query = db
      .select({
        recipe: recipes,
        author: {
          id: users.id,
          name: users.name,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(recipes)
      .innerJoin(users, eq(recipes.authorId, users.id))
      .where(
        and(
          eq(recipes.status, 'PUBLISHED'),
          dto.q ? ilike(recipes.title, `%${dto.q}%`) : undefined,
          dto.region ? eq(recipes.originRegion, dto.region) : undefined,
          dto.difficulty ? eq(recipes.difficulty, dto.difficulty) : undefined,
        ),
      )
      .orderBy(desc(recipes.createdAt))
      .limit(limit)
      .offset(offset);

    const rows = await query;
    const stats = await this.getStatsFor(rows.map((row) => row.recipe.id));
    return rows.map((row) => toFeedItem(row, stats));
  }

  async getById(id: string): Promise<FeedRecipeItem> {
    const db = this.databaseService.db;

    const [row] = await db
      .select({
        recipe: recipes,
        author: {
          id: users.id,
          name: users.name,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(recipes)
      .innerJoin(users, eq(recipes.authorId, users.id))
      .where(eq(recipes.id, id))
      .limit(1);

    if (!row) {
      throw new NotFoundException('Receta no encontrada');
    }

    const stats = await this.getStatsFor([id]);
    return { ...toFeedItem(row, stats), reviewNotes: row.recipe.reviewNotes };
  }

  async getDetail(
    id: string,
    viewer?: AuthenticatedUser,
  ): Promise<RecipeDetailItem> {
    const db = this.databaseService.db;
    const base = await this.getById(id);

    // Lo no publicado solo lo ven su autor y el admin; al resto se le responde 404
    const canSeeUnpublished =
      viewer !== undefined && (viewer.id === base.author.id || viewer.role === 'ADMIN');
    if (base.status !== 'PUBLISHED' && !canSeeUnpublished) {
      throw new NotFoundException('Receta no encontrada');
    }

    const [recipeRow] = await db
      .select({ instructions: recipes.instructions })
      .from(recipes)
      .where(eq(recipes.id, id))
      .limit(1);

    const ingredientRows = await db
      .select({
        name: ingredients.name,
        quantity: recipeIngredients.quantity,
        unit: recipeIngredients.unit,
        notes: recipeIngredients.notes,
      })
      .from(recipeIngredients)
      .innerJoin(ingredients, eq(recipeIngredients.ingredientId, ingredients.id))
      .where(eq(recipeIngredients.recipeId, id));

    const galleryRows = await db
      .select({ url: recipeImages.url })
      .from(recipeImages)
      .where(eq(recipeImages.recipeId, id))
      .orderBy(asc(recipeImages.position));

    let userReaction: RecipeDetailItem['userReaction'] = null;
    let isBookmarked = false;
    if (viewer) {
      const [reaction] = await db
        .select({ type: recipeReactions.type })
        .from(recipeReactions)
        .where(
          and(eq(recipeReactions.recipeId, id), eq(recipeReactions.userId, viewer.id)),
        )
        .limit(1);
      userReaction = reaction ? reaction.type : null;

      const [bookmark] = await db
        .select({ id: recipeBookmarks.id })
        .from(recipeBookmarks)
        .where(
          and(eq(recipeBookmarks.recipeId, id), eq(recipeBookmarks.userId, viewer.id)),
        )
        .limit(1);
      isBookmarked = bookmark !== undefined;
    }

    return {
      ...base,
      // Las observaciones de moderacion son privadas del autor y del admin
      reviewNotes: canSeeUnpublished ? base.reviewNotes : null,
      ingredients: ingredientRows,
      galleryImageUrls: galleryRows.map((row) => row.url),
      steps: [...(recipeRow?.instructions ?? [])].sort((a, b) => a.stepNumber - b.stepNumber),
      userReaction,
      isBookmarked,
    };
  }

  async update(
    recipeId: string,
    editor: AuthenticatedUser,
    dto: CreateRecipeDto,
  ): Promise<FeedRecipeItem> {
    const images = this.resolveImages(dto);
    const db = this.databaseService.db;

    const [recipe] = await db
      .select({ authorId: recipes.authorId })
      .from(recipes)
      .where(eq(recipes.id, recipeId))
      .limit(1);

    if (!recipe) {
      throw new NotFoundException('Receta no encontrada');
    }
    // Solo el autor edita; el admin modera aprobando, devolviendo o eliminando
    if (recipe.authorId !== editor.id) {
      throw new ForbiddenException('Solo el autor puede editar esta receta');
    }

    // Lo editado por un colaborador vuelve a revision (regla 4.3.4.a); al reenviar se limpian las observaciones
    const status = this.resolveInitialStatus(editor.role, dto.status);
    await db
      .update(recipes)
      .set({
        title: dto.title,
        description: dto.description,
        prepTimeMinutes: dto.prepTimeMinutes,
        cookTimeMinutes: dto.cookTimeMinutes,
        servings: dto.servings,
        difficulty: dto.difficulty,
        coverImageUrl: images.coverImageUrl,
        originRegion: dto.originRegion || 'Jutiapa',
        instructions: dto.instructions,
        status,
        ...(status === 'DRAFT' ? {} : { reviewNotes: null }),
        updatedAt: new Date(),
      })
      .where(eq(recipes.id, recipeId));

    await db.delete(recipeIngredients).where(eq(recipeIngredients.recipeId, recipeId));
    await this.attachIngredients(recipeId, dto.ingredients);
    await this.replaceGallery(recipeId, images.gallery);

    return this.getById(recipeId);
  }

  async listMine(authorId: string): Promise<FeedRecipeItem[]> {
    const rows = await this.databaseService.db
      .select({ id: recipes.id })
      .from(recipes)
      .where(eq(recipes.authorId, authorId))
      .orderBy(desc(recipes.updatedAt));

    return Promise.all(rows.map((row) => this.getById(row.id)));
  }

  async delete(recipeId: string, userId: string, userRole: string): Promise<void> {
    const db = this.databaseService.db;

    const [recipe] = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, recipeId))
      .limit(1);

    if (!recipe) {
      throw new NotFoundException('Receta no encontrada');
    }

    // Ownership-based access
    if (recipe.authorId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('No tienes permiso para eliminar esta receta');
    }

    await db.delete(recipes).where(eq(recipes.id, recipeId));
  }

  private async attachIngredients(
    recipeId: string,
    items: RecipeIngredientInputDto[],
  ): Promise<void> {
    const db = this.databaseService.db;

    for (const ing of items) {
      // Catalogo oficial normalizado: se reutiliza el ingrediente o se crea
      const normalizedName = ing.ingredientName.trim().toLowerCase();

      let [foundIngredient] = await db
        .select()
        .from(ingredients)
        .where(eq(ingredients.name, normalizedName))
        .limit(1);

      if (!foundIngredient) {
        [foundIngredient] = await db
          .insert(ingredients)
          .values({ name: normalizedName, category: 'General' })
          .returning();
      }

      await db.insert(recipeIngredients).values({
        recipeId,
        ingredientId: foundIngredient.id,
        quantity: ing.quantity,
        unit: ing.unit,
        notes: ing.notes,
      });
    }
  }

  // Regla de negocio 4.3.4.a: lo que publica un colaborador pasa por revision del admin
  private resolveInitialStatus(
    authorRole: UserRole,
    requested: CreateRecipeDto['status'],
  ): 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' {
    if (requested === 'DRAFT') return 'DRAFT';
    return authorRole === 'ADMIN' ? 'PUBLISHED' : 'PENDING_REVIEW';
  }

  // Reacciones y comentarios de varias recetas en dos consultas agrupadas
  private async getStatsFor(recipeIds: string[]): Promise<Map<string, RecipeStats>> {
    const stats = new Map<string, RecipeStats>();
    if (recipeIds.length === 0) return stats;
    const db = this.databaseService.db;

    const [reactions, comments] = await Promise.all([
      db
        .select({
          recipeId: recipeReactions.recipeId,
          type: recipeReactions.type,
          count: sql<number>`count(*)::int`,
        })
        .from(recipeReactions)
        .where(inArray(recipeReactions.recipeId, recipeIds))
        .groupBy(recipeReactions.recipeId, recipeReactions.type),
      db
        .select({
          recipeId: recipeComments.recipeId,
          count: sql<number>`count(*)::int`,
        })
        .from(recipeComments)
        .where(inArray(recipeComments.recipeId, recipeIds))
        .groupBy(recipeComments.recipeId),
    ]);

    const entry = (id: string): RecipeStats => {
      let current = stats.get(id);
      if (!current) {
        current = { reactionCounts: { like: 0, yummy: 0, triedIt: 0 }, commentsCount: 0 };
        stats.set(id, current);
      }
      return current;
    };
    for (const r of reactions) {
      const counts = entry(r.recipeId).reactionCounts;
      if (r.type === 'LIKE') counts.like = r.count;
      if (r.type === 'YUMMY') counts.yummy = r.count;
      if (r.type === 'TRIED_IT') counts.triedIt = r.count;
    }
    for (const c of comments) entry(c.recipeId).commentsCount = c.count;

    return stats;
  }

  // Ingredientes que el usuario tiene y los que le faltan, para todas las candidatas en una consulta
  private async getBreakdownsFor(
    recipeIds: string[],
    matchedIngredientIds: string[],
  ): Promise<Map<string, { matchedNames: string[]; missingNames: string[] }>> {
    const breakdowns = new Map<string, { matchedNames: string[]; missingNames: string[] }>();
    if (recipeIds.length === 0) return breakdowns;

    const rows = await this.databaseService.db
      .select({
        recipeId: recipeIngredients.recipeId,
        ingredientId: recipeIngredients.ingredientId,
        name: ingredients.name,
      })
      .from(recipeIngredients)
      .innerJoin(ingredients, eq(recipeIngredients.ingredientId, ingredients.id))
      .where(inArray(recipeIngredients.recipeId, recipeIds));

    const matched = new Set(matchedIngredientIds);
    for (const row of rows) {
      let breakdown = breakdowns.get(row.recipeId);
      if (!breakdown) {
        breakdown = { matchedNames: [], missingNames: [] };
        breakdowns.set(row.recipeId, breakdown);
      }
      (matched.has(row.ingredientId) ? breakdown.matchedNames : breakdown.missingNames).push(row.name);
    }

    return breakdowns;
  }
}

interface RecipeStats {
  reactionCounts: { like: number; yummy: number; triedIt: number };
  commentsCount: number;
}

interface RecipeWithAuthor {
  recipe: typeof recipes.$inferSelect;
  author: FeedRecipeItem['author'];
}

// Forma comun de una receta en el feed, la busqueda y el detalle
function toFeedItem(row: RecipeWithAuthor, stats: Map<string, RecipeStats>): FeedRecipeItem {
  const recipeStats = stats.get(row.recipe.id);
  return {
    id: row.recipe.id,
    title: row.recipe.title,
    description: row.recipe.description,
    prepTimeMinutes: row.recipe.prepTimeMinutes,
    cookTimeMinutes: row.recipe.cookTimeMinutes,
    servings: row.recipe.servings,
    difficulty: row.recipe.difficulty,
    coverImageUrl: row.recipe.coverImageUrl,
    originRegion: row.recipe.originRegion,
    sourceType: row.recipe.sourceType,
    sourceName: row.recipe.sourceName,
    sourceUrl: row.recipe.sourceUrl,
    status: row.recipe.status,
    createdAt: row.recipe.createdAt,
    author: row.author,
    reactionCounts: recipeStats?.reactionCounts ?? { like: 0, yummy: 0, triedIt: 0 },
    commentsCount: recipeStats?.commentsCount ?? 0,
  };
}
