import { API_BASE_URL } from '@/shared/lib/apiClient';

// El backend responde el PDF como adjunto; el navegador lo descarga sin salir de la pagina
export function recipePdfUrl(recipeId: string): string {
  return `${API_BASE_URL}/exports/recipes/${recipeId}/pdf`;
}

export function cookbookPdfUrl(): string {
  return `${API_BASE_URL}/exports/cookbook/pdf`;
}
