import { apiClient } from '@/shared/lib/apiClient';
import type { RelatedRecipe } from '../types';

// GET /recipes/search por region: otras recetas del mismo lugar; sin conexion simplemente no se muestran
export async function getRelatedRecipes(region: string, excludeId: string): Promise<RelatedRecipe[]> {
  try {
    const data = await apiClient<RelatedRecipe[]>('recipes/search', { params: { region, limit: 7 } });
    return data.filter((recipe) => recipe.id !== excludeId).slice(0, 6);
  } catch {
    return [];
  }
}
