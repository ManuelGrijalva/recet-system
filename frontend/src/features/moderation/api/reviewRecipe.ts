import { apiClient } from '@/shared/lib/apiClient';
import type { PendingRecipe, ReviewDecision } from '../types';

export function reviewRecipe(
  recipeId: string,
  review: ReviewDecision,
): Promise<PendingRecipe> {
  return apiClient<PendingRecipe>(`moderation/recipes/${recipeId}`, {
    method: 'PATCH',
    body: JSON.stringify(review),
  });
}
