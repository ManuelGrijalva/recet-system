import { apiClient } from '@/shared/lib/apiClient';
import type { PendingRecipe } from '../types';

export function getPublishedRecipes(query: string): Promise<PendingRecipe[]> {
  return apiClient<PendingRecipe[]>('moderation/recipes/published', {
    params: { q: query.trim() || undefined },
  });
}
