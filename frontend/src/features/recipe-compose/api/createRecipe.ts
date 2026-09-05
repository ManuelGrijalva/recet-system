import { apiClient } from '@/shared/lib/apiClient';
import type { CreateRecipePayload } from '../types';

export interface CreatedRecipe {
  id: string;
  title: string;
  status: string;
}

/**
 * `POST /recipes`. Requiere sesión. Sin fallback: el hook decide qué mensaje
 * mostrar si la promesa se rechaza.
 */
export function createRecipe(
  payload: CreateRecipePayload,
): Promise<CreatedRecipe> {
  return apiClient<CreatedRecipe>('recipes', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
