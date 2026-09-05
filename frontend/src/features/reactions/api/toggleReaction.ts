import { apiClient } from '@/shared/lib/apiClient';
import type { ReactionType, ToggleReactionResponse } from '../types';

/**
 * `POST /interactions/recipes/:recipeId/reactions`
 * Requiere sesión (cookie JWT). Sin fallback: si falla, el hook revierte
 * el update optimista.
 */
export function toggleReaction(
  recipeId: string,
  type: ReactionType,
): Promise<ToggleReactionResponse> {
  return apiClient<ToggleReactionResponse>(
    `interactions/recipes/${recipeId}/reactions`,
    {
      method: 'POST',
      body: JSON.stringify({ type }),
    },
  );
}
