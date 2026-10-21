import { apiClient } from '@/shared/lib/apiClient';
import type { RecipeFeedPage, RecipeFeedQuery } from '../types';

// GET /recipes/following: sin datos semilla, depende de a quien sigue el usuario
export function getFollowingFeed(query: RecipeFeedQuery = {}): Promise<RecipeFeedPage> {
  const { page = 1, limit = 10 } = query;
  return apiClient<RecipeFeedPage>('recipes/following', { params: { page, limit } });
}
