export interface SavedRecipe {
  id: string;
  title: string;
  author: string;
  region: string;
  timeMinutes: number;
  savedLabel: string;
  coverImageUrl: string | null;
  coverImageCredit: string | null;
  coverImageCreditUrl: string | null;
}

// Forma de cada fila de GET /interactions/bookmarks
export interface BookmarkRow {
  bookmarkId: string;
  savedAt: string;
  recipe: {
    id: string;
    title: string;
    prepTimeMinutes: number;
    cookTimeMinutes: number;
    originRegion: string;
    coverImageUrl?: string | null;
    coverImageCredit?: string | null;
    coverImageCreditUrl?: string | null;
  };
  author: { id: string; name: string };
}
