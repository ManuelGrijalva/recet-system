import { apiClient } from '@/shared/lib/apiClient';
import type { EditableRecipe } from '../types';

export function getEditableRecipe(recipeId: string): Promise<EditableRecipe> {
  return apiClient<EditableRecipe>(`recipes/${recipeId}`);
}
