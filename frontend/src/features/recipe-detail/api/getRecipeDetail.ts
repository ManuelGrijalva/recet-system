import { ApiError, apiClient } from '@/shared/lib/apiClient';
import type { RecipeDetail } from '../types';
import { recipeDetailFallback, recipeDetailMock } from './recipeDetail.mock';

// El seed solo cubre la falta de backend; un 404 real se propaga como error
export async function getRecipeDetail(id: string): Promise<RecipeDetail> {
  try {
    return await apiClient<RecipeDetail>(`recipes/${id}`);
  } catch (err) {
    if (err instanceof ApiError) {
      throw new Error(
        err.status === 404 || err.status === 400
          ? 'Receta no encontrada.'
          : err.message,
      );
    }
    return recipeDetailMock[id] ?? recipeDetailFallback;
  }
}
