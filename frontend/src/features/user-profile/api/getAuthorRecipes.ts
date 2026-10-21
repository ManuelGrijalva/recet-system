import { apiClient } from '@/shared/lib/apiClient';
import type { RecipeFeedPage } from '@/features/recipe-feed';

export function getAuthorRecipes(authorId: string): Promise<RecipeFeedPage> {
  return apiClient<RecipeFeedPage>(`recipes/author/${authorId}`, { params: { limit: 30 } });
}
