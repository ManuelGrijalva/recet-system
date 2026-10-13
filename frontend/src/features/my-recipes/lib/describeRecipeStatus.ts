import type { MyRecipe } from '../types';

// Una receta en borrador con observaciones es una receta devuelta por el admin
export function describeRecipeStatus(recipe: Pick<MyRecipe, 'status' | 'reviewNotes'>): string {
  switch (recipe.status) {
    case 'PUBLISHED':
      return 'Publicada';
    case 'PENDING_REVIEW':
      return 'En revisión';
    case 'ARCHIVED':
      return 'Archivada';
    case 'DRAFT':
      return recipe.reviewNotes ? 'Devuelta con observaciones' : 'Borrador';
  }
}
