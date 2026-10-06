import { apiClient } from '@/shared/lib/apiClient';
import type { PendingRecipe } from '../types';

// Sin fallback: con datos semilla el admin intentaria moderar recetas inexistentes
export function getPendingRecipes(): Promise<PendingRecipe[]> {
  return apiClient<PendingRecipe[]>('moderation/recipes/pending');
}
