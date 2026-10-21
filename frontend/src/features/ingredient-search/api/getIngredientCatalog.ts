import { apiClient } from '@/shared/lib/apiClient';
import { withFallback } from '@/shared/lib/withFallback';
import { COMMON_JUTIAPA_INGREDIENTS } from '../lib/commonIngredients';
import type { CatalogIngredient } from '../types';

// GET /ingredients: ingredientes de recetas publicadas, los mas usados primero
export function getIngredientCatalog(): Promise<CatalogIngredient[]> {
  return withFallback(
    () => apiClient<CatalogIngredient[]>('ingredients'),
    () => COMMON_JUTIAPA_INGREDIENTS.map((name) => ({ name, recipeCount: 0 })),
  );
}
