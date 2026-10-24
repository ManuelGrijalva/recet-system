import type {
  AuthorSummary,
  Difficulty,
  ReactionCounts,
  RecipeStatus,
} from '@/shared/types';
import type { ReactionType } from '@/features/reactions';

export interface RecipeIngredient {
  name: string;
  quantity: string;
  unit: string;
  notes?: string | null;
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
}

export interface RecipeDetail {
  id: string;
  title: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: Difficulty;
  coverImageUrl: string | null;
  coverImageCredit?: string | null;
  coverImageCreditUrl?: string | null;
  originRegion: string;
  sourceType?: 'REFERENCE' | 'INTERVIEW' | 'COMMUNITY';
  sourceName?: string | null;
  sourceUrl?: string | null;
  status: RecipeStatus;
  // Solo llega con valor para el autor o el admin
  reviewNotes?: string | null;
  createdAt: string;
  author: AuthorSummary & { role?: string };
  reactionCounts: ReactionCounts;
  userReaction: ReactionType | null;
  isBookmarked?: boolean;
  // Fotos despues de la portada; opcional mientras convive con el backend anterior
  galleryImageUrls?: string[];
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
}

// Receta del mismo lugar para la seccion "Mas recetas de ..." al final del detalle
export interface RelatedRecipe {
  id: string;
  title: string;
  originRegion: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  coverImageUrl: string | null;
  coverImageCredit?: string | null;
  coverImageCreditUrl?: string | null;
}
