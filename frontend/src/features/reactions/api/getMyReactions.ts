import { apiClient } from '@/shared/lib/apiClient';
import type { ReactionType } from '../types';

// GET /interactions/reactions/mine: la reaccion del usuario en cada receta visible
export function getMyReactions(recipeIds: string[]): Promise<Record<string, ReactionType>> {
  return apiClient<Record<string, ReactionType>>('interactions/reactions/mine', {
    params: { recipeIds: recipeIds.slice(0, 50).join(',') },
  });
}
