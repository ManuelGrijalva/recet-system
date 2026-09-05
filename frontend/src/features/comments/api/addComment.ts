import { apiClient } from '@/shared/lib/apiClient';
import type { CommentData, NewCommentInput } from '../types';

/**
 * `POST /interactions/recipes/:recipeId/comments`
 * Requiere sesión. Sin fallback: el hook maneja el update optimista y el
 * rollback si esta promesa se rechaza.
 */
export function addComment(
  recipeId: string,
  input: NewCommentInput,
): Promise<CommentData> {
  return apiClient<CommentData>(
    `interactions/recipes/${recipeId}/comments`,
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
  );
}
