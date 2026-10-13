import { apiClient } from '@/shared/lib/apiClient';

export function toggleBookmark(recipeId: string): Promise<{ isBookmarked: boolean }> {
  return apiClient<{ isBookmarked: boolean }>(`interactions/recipes/${recipeId}/bookmarks`, {
    method: 'POST',
  });
}
