import { apiClient } from '@/shared/lib/apiClient';
import { withFallback } from '@/shared/lib/withFallback';
import type { RecipeFeedPage, RecipeFeedQuery } from '../types';
import { recipeFeedMock } from './recipeFeed.mock';

/**
 * `GET /recipes/feed` — feed paginado de la comunidad.
 * Cae al seed local si el backend no responde.
 */
export function getRecipeFeed(
  query: RecipeFeedQuery = {},
): Promise<RecipeFeedPage> {
  const { page = 1, limit = 10 } = query;

  return withFallback(
    () =>
      apiClient<RecipeFeedPage>('recipes/feed', {
        params: { page, limit },
      }),
    recipeFeedMock,
  );
}
