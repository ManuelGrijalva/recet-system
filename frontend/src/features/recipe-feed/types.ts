import type {
  AuthorSummary,
  Difficulty,
  ReactionCounts,
  RecipeStatus,
} from '@/shared/types';

/**
 * Receta tal como llega en el feed de la comunidad.
 * Espeja `FeedRecipeItem` del backend (`GET /recipes/feed`), con `createdAt`
 * ya serializado a string.
 */
export interface FeedRecipe {
  id: string;
  title: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: Difficulty;
  coverImageUrl: string | null;
  // Credito de fotos con licencia libre; opcional mientras convive con el backend anterior
  coverImageCredit?: string | null;
  coverImageCreditUrl?: string | null;
  originRegion: string;
  status: RecipeStatus;
  createdAt: string;
  author: AuthorSummary;
  reactionCounts: ReactionCounts;
  commentsCount: number;
}

export interface RecipeFeedPage {
  items: FeedRecipe[];
  total: number;
}

export interface RecipeFeedQuery {
  page?: number;
  limit?: number;
}

// all: toda la comunidad; following: solo autores que sigue el usuario
export type FeedMode = 'all' | 'following';
