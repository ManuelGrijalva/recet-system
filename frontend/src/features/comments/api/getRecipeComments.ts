import { apiClient } from '@/shared/lib/apiClient';
import { withFallback } from '@/shared/lib/withFallback';
import type { CommentData } from '../types';
import { recipeCommentsMock } from './recipeComments.mock';

/**
 * `GET /interactions/recipes/:recipeId/comments`
 * Cae al hilo semilla si el backend no responde.
 */
export function getRecipeComments(recipeId: string): Promise<CommentData[]> {
  return withFallback(
    () =>
      apiClient<CommentData[]>(
        `interactions/recipes/${recipeId}/comments`,
      ),
    () => recipeCommentsMock[recipeId] ?? [],
  );
}
