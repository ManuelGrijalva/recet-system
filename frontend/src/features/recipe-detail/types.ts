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
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
}

/**
 * Receta completa para la vista de detalle. Extiende el payload del feed con
 * la información estructurada de preparación (ingredientes y pasos).
 *
 * Nota: `GET /recipes/:id` del backend aún no devuelve `ingredients`/`steps`;
 * `getRecipeDetail` completa esos arreglos desde el seed hasta que el backend
 * los exponga.
 */
export interface RecipeDetail {
  id: string;
  title: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: Difficulty;
  coverImageUrl: string | null;
  originRegion: string;
  status: RecipeStatus;
  createdAt: string;
  author: AuthorSummary & { role?: string };
  reactionCounts: ReactionCounts;
  userReaction: ReactionType | null;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
}
