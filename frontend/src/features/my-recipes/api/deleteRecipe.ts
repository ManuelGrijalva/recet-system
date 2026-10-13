import { apiClient } from '@/shared/lib/apiClient';

export async function deleteRecipe(recipeId: string): Promise<void> {
  await apiClient<Record<string, never>>(`recipes/${recipeId}`, { method: 'DELETE' });
}
