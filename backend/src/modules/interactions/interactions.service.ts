import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, asc, desc, eq } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service';
import {
  recipeBookmarks,
  recipeComments,
  recipeReactions,
  recipes,
  users,
} from '../../database/schema';
import { CreateCommentDto } from './dto/comment.dto';

export interface CommentWithAuthor {
  id: string;
  content: string;
  createdAt: Date;
  parentId: string | null;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  replies?: CommentWithAuthor[];
}

@Injectable()
export class InteractionsService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Alternar o actualizar reaccion (LIKE, YUMMY, TRIED_IT).
   * Unicidad estricta por usuario y receta. Si presiona la misma reaccion, se retira (toggle).
   */
  async toggleReaction(
    userId: string,
    recipeId: string,
    type: 'LIKE' | 'YUMMY' | 'TRIED_IT',
  ): Promise<{ action: 'ADDED' | 'UPDATED' | 'REMOVED'; currentType: string | null }> {
    const db = this.databaseService.db;

    const [existing] = await db
      .select()
      .from(recipeReactions)
      .where(
        and(
          eq(recipeReactions.userId, userId),
          eq(recipeReactions.recipeId, recipeId),
        ),
      )
      .limit(1);

    if (existing) {
      if (existing.type === type) {
        // Toggle OFF
        await db
          .delete(recipeReactions)
          .where(eq(recipeReactions.id, existing.id));
        return { action: 'REMOVED', currentType: null };
      } else {
        // Cambiar a nuevo tipo de reaccion
        await db
          .update(recipeReactions)
          .set({ type })
          .where(eq(recipeReactions.id, existing.id));
        return { action: 'UPDATED', currentType: type };
      }
    }

    // Insertar nueva reaccion
    await db.insert(recipeReactions).values({
      userId,
      recipeId,
      type,
    });

    return { action: 'ADDED', currentType: type };
  }

  /**
   * Alternar guardado (Bookmark) para coleccion privada de recetas.
   */
  async toggleBookmark(
    userId: string,
    recipeId: string,
  ): Promise<{ isBookmarked: boolean }> {
    const db = this.databaseService.db;

    const [existing] = await db
      .select()
      .from(recipeBookmarks)
      .where(
        and(
          eq(recipeBookmarks.userId, userId),
          eq(recipeBookmarks.recipeId, recipeId),
        ),
      )
      .limit(1);

    if (existing) {
      await db
        .delete(recipeBookmarks)
        .where(eq(recipeBookmarks.id, existing.id));
      return { isBookmarked: false };
    }

    await db.insert(recipeBookmarks).values({
      userId,
      recipeId,
    });

    return { isBookmarked: true };
  }

  /**
   * Obtener recetario guardado del usuario (ordenado por fecha descendente).
   */
  async getUserBookmarks(userId: string) {
    const db = this.databaseService.db;

    return db
      .select({
        bookmarkId: recipeBookmarks.id,
        savedAt: recipeBookmarks.createdAt,
        recipe: {
          id: recipes.id,
          title: recipes.title,
          description: recipes.description,
          prepTimeMinutes: recipes.prepTimeMinutes,
          cookTimeMinutes: recipes.cookTimeMinutes,
          servings: recipes.servings,
          difficulty: recipes.difficulty,
          coverImageUrl: recipes.coverImageUrl,
          originRegion: recipes.originRegion,
        },
      })
      .from(recipeBookmarks)
      .innerJoin(recipes, eq(recipeBookmarks.recipeId, recipes.id))
      .where(eq(recipeBookmarks.userId, userId))
      .orderBy(desc(recipeBookmarks.createdAt));
  }

  /**
   * Agregar comentario o respuesta con limite de 1 nivel de anidacion.
   */
  async addComment(
    userId: string,
    recipeId: string,
    dto: CreateCommentDto,
  ): Promise<CommentWithAuthor> {
    const db = this.databaseService.db;

    // Si tiene parentId, verificar que el padre sea un comentario raiz (sin padre)
    if (dto.parentId) {
      const [parent] = await db
        .select()
        .from(recipeComments)
        .where(eq(recipeComments.id, dto.parentId))
        .limit(1);

      if (!parent) {
        throw new NotFoundException('Comentario padre no encontrado');
      }

      if (parent.parentId !== null) {
        throw new BadRequestException('Solo se permite 1 nivel de respuestas a comentarios');
      }
    }

    const [newComment] = await db
      .insert(recipeComments)
      .values({
        userId,
        recipeId,
        parentId: dto.parentId || null,
        content: dto.content,
      })
      .returning();

    const [author] = await db
      .select({
        id: users.id,
        name: users.name,
        avatarUrl: users.avatarUrl,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return {
      id: newComment.id,
      content: newComment.content,
      createdAt: newComment.createdAt,
      parentId: newComment.parentId,
      author,
      replies: [],
    };
  }

  /**
   * Obtener comentarios de una receta estructurados en hilos de 1 nivel.
   */
  async getRecipeComments(recipeId: string): Promise<CommentWithAuthor[]> {
    const db = this.databaseService.db;

    const rawComments = await db
      .select({
        comment: recipeComments,
        author: {
          id: users.id,
          name: users.name,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(recipeComments)
      .innerJoin(users, eq(recipeComments.userId, users.id))
      .where(eq(recipeComments.recipeId, recipeId))
      .orderBy(asc(recipeComments.createdAt));

    const rootComments: CommentWithAuthor[] = [];
    const repliesMap = new Map<string, CommentWithAuthor[]>();

    for (const item of rawComments) {
      const formatted: CommentWithAuthor = {
        id: item.comment.id,
        content: item.comment.content,
        createdAt: item.comment.createdAt,
        parentId: item.comment.parentId,
        author: item.author,
        replies: [],
      };

      if (!item.comment.parentId) {
        rootComments.push(formatted);
      } else {
        const existing = repliesMap.get(item.comment.parentId) || [];
        existing.push(formatted);
        repliesMap.set(item.comment.parentId, existing);
      }
    }

    for (const root of rootComments) {
      root.replies = repliesMap.get(root.id) || [];
    }

    return rootComments;
  }

  /**
   * Eliminar comentario respetando propiedad (Ownership).
   */
  async deleteComment(
    commentId: string,
    userId: string,
    userRole: string,
  ): Promise<void> {
    const db = this.databaseService.db;

    const [comment] = await db
      .select()
      .from(recipeComments)
      .where(eq(recipeComments.id, commentId))
      .limit(1);

    if (!comment) {
      throw new NotFoundException('Comentario no encontrado');
    }

    if (comment.userId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('No tienes permiso para eliminar este comentario');
    }

    await db.delete(recipeComments).where(eq(recipeComments.id, commentId));
  }
}
