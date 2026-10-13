import { apiClient } from '@/shared/lib/apiClient';
import type { CreateRecipePayload } from '../types';
import type { CreatedRecipe } from './createRecipe';

export function updateRecipe(
  recipeId: string,
  payload: CreateRecipePayload,
): Promise<CreatedRecipe> {
  return apiClient<CreatedRecipe>(`recipes/${recipeId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}
