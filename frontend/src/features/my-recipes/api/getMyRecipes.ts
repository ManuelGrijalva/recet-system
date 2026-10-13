import { apiClient } from '@/shared/lib/apiClient';
import type { MyRecipe } from '../types';

export function getMyRecipes(): Promise<MyRecipe[]> {
  return apiClient<MyRecipe[]>('recipes/mine');
}
