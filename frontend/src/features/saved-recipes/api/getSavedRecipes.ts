import { apiClient } from '@/shared/lib/apiClient';
import type { BookmarkRow, SavedRecipe } from '../types';

const savedDateFormatter = new Intl.DateTimeFormat('es-GT', { day: 'numeric', month: 'short' });

// Sin datos semilla: el recetario es personal; sin conexion lo cubre el service worker
export async function getSavedRecipes(): Promise<SavedRecipe[]> {
  const rows = await apiClient<BookmarkRow[]>('interactions/bookmarks');
  return rows.map((row) => ({
    id: row.recipe.id,
    title: row.recipe.title,
    author: row.author.name,
    region: row.recipe.originRegion,
    timeMinutes: row.recipe.prepTimeMinutes + row.recipe.cookTimeMinutes,
    savedLabel: `Guardada el ${savedDateFormatter.format(new Date(row.savedAt))}`,
    coverImageUrl: row.recipe.coverImageUrl ?? null,
    coverImageCredit: row.recipe.coverImageCredit ?? null,
    coverImageCreditUrl: row.recipe.coverImageCreditUrl ?? null,
  }));
}
