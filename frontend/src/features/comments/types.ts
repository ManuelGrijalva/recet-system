import type { AuthorSummary } from '@/shared/types';

/**
 * Comentario de una receta. Espeja `CommentWithAuthor` del backend
 * (`GET /interactions/recipes/:recipeId/comments`) con `createdAt` serializado.
 * Se admite un único nivel de respuestas (`replies`).
 */
export interface CommentData {
  id: string;
  content: string;
  createdAt: string;
  parentId: string | null;
  author: AuthorSummary;
  replies?: CommentData[];
}

export interface NewCommentInput {
  content: string;
  parentId?: string;
}
