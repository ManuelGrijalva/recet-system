import { apiClient } from '@/shared/lib/apiClient';
import { withFallback } from '@/shared/lib/withFallback';
import type { SavedRecipe } from '../types';
import { savedRecipesMock } from './savedRecipes.mock';

/**
 * `GET /interactions/bookmarks` — recetario guardado del usuario.
 * Requiere sesión; cae al seed local si no hay sesión o backend.
 */
export function getSavedRecipes(): Promise<SavedRecipe[]> {
  return withFallback(
    () => apiClient<SavedRecipe[]>('interactions/bookmarks'),
    savedRecipesMock,
  );
}
