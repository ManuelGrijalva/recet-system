import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, desc, eq, ilike, inArray, sql } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service';
import {
  ingredients,
  recipeIngredients,
  recipes,
  recipeReactions,
  recipeComments,
  users,
} from '../../database/schema';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { SearchRecipesDto } from './dto/search-recipe.dto';

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
  status: 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'ARCHIVED';
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
}

@Injectable()
export class RecipesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(authorId: string, dto: CreateRecipeDto): Promise<FeedRecipeItem> {
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
        coverImageUrl: dto.coverImageUrl,
        status: dto.status || 'PUBLISHED',
        originRegion: dto.originRegion || 'Jutiapa',
        instructions: dto.instructions,
      })
      .returning();

    // 2. Resolver o insertar ingredientes en catalogo oficial
    for (const ing of dto.ingredients) {
      const normalizedName = ing.ingredientName.trim().toLowerCase();

      let [foundIngredient] = await db
        .select()
        .from(ingredients)
        .where(eq(ingredients.name, normalizedName))
        .limit(1);

      if (!foundIngredient) {
        [foundIngredient] = await db
          .insert(ingredients)
          .values({
            name: normalizedName,
            category: 'General',
          })
          .returning();
      }

      await db.insert(recipeIngredients).values({
        recipeId: newRecipe.id,
        ingredientId: foundIngredient.id,
        quantity: ing.quantity,
        unit: ing.unit,
        notes: ing.notes,
      });
    }

    return this.getById(newRecipe.id);
  }

  async getFeed(page = 1, limit = 10): Promise<{ items: FeedRecipeItem[]; total: number }> {
    const db = this.databaseService.db;
    const offset = (page - 1) * limit;

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
      .where(eq(recipes.status, 'PUBLISHED'))
      .orderBy(desc(recipes.createdAt))
      .limit(limit)
      .offset(offset);

    const items: FeedRecipeItem[] = [];

    for (const row of publishedRecipes) {
      const stats = await this.getRecipeStats(row.recipe.id);
      items.push({
        id: row.recipe.id,
        title: row.recipe.title,
        description: row.recipe.description,
        prepTimeMinutes: row.recipe.prepTimeMinutes,
        cookTimeMinutes: row.recipe.cookTimeMinutes,
        servings: row.recipe.servings,
        difficulty: row.recipe.difficulty,
        coverImageUrl: row.recipe.coverImageUrl,
        originRegion: row.recipe.originRegion,
        status: row.recipe.status,
        createdAt: row.recipe.createdAt,
        author: row.author,
        reactionCounts: stats.reactionCounts,
        commentsCount: stats.commentsCount,
      });
    }

    const [totalRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(recipes)
      .where(eq(recipes.status, 'PUBLISHED'));

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
      const availableList = dto.ingredients
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter((s) => s.length > 0);

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

        const results: FeedRecipeItem[] = [];
        for (const cand of candidateRecipes) {
          const stats = await this.getRecipeStats(cand.recipe.id);
          results.push({
            id: cand.recipe.id,
            title: cand.recipe.title,
            description: cand.recipe.description,
            prepTimeMinutes: cand.recipe.prepTimeMinutes,
            cookTimeMinutes: cand.recipe.cookTimeMinutes,
            servings: cand.recipe.servings,
            difficulty: cand.recipe.difficulty,
            coverImageUrl: cand.recipe.coverImageUrl,
            originRegion: cand.recipe.originRegion,
            status: cand.recipe.status,
            createdAt: cand.recipe.createdAt,
            author: cand.author,
            reactionCounts: stats.reactionCounts,
            commentsCount: stats.commentsCount,
            matchPercentage: scoredMap.get(cand.recipe.id) || 0,
          });
        }

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
    const results: FeedRecipeItem[] = [];

    for (const row of rows) {
      const stats = await this.getRecipeStats(row.recipe.id);
      results.push({
        id: row.recipe.id,
        title: row.recipe.title,
        description: row.recipe.description,
        prepTimeMinutes: row.recipe.prepTimeMinutes,
        cookTimeMinutes: row.recipe.cookTimeMinutes,
        servings: row.recipe.servings,
        difficulty: row.recipe.difficulty,
        coverImageUrl: row.recipe.coverImageUrl,
        originRegion: row.recipe.originRegion,
        status: row.recipe.status,
        createdAt: row.recipe.createdAt,
        author: row.author,
        reactionCounts: stats.reactionCounts,
        commentsCount: stats.commentsCount,
      });
    }

    return results;
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

    const stats = await this.getRecipeStats(id);

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
      status: row.recipe.status,
      createdAt: row.recipe.createdAt,
      author: row.author,
      reactionCounts: stats.reactionCounts,
      commentsCount: stats.commentsCount,
    };
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

  private async getRecipeStats(recipeId: string): Promise<{
    reactionCounts: { like: number; yummy: number; triedIt: number };
    commentsCount: number;
  }> {
    const db = this.databaseService.db;

    const reactions = await db
      .select({
        type: recipeReactions.type,
        count: sql<number>`count(*)::int`,
      })
      .from(recipeReactions)
      .where(eq(recipeReactions.recipeId, recipeId))
      .groupBy(recipeReactions.type);

    const counts = { like: 0, yummy: 0, triedIt: 0 };
    for (const r of reactions) {
      if (r.type === 'LIKE') counts.like = r.count;
      if (r.type === 'YUMMY') counts.yummy = r.count;
      if (r.type === 'TRIED_IT') counts.triedIt = r.count;
    }

    const [commentRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(recipeComments)
      .where(eq(recipeComments.recipeId, recipeId));

    return {
      reactionCounts: counts,
      commentsCount: commentRow ? commentRow.count : 0,
    };
  }
}
