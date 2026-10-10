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
  originRegion: string;
  status: RecipeStatus;
  // Solo llega con valor para el autor o el admin
  reviewNotes?: string | null;
  createdAt: string;
  author: AuthorSummary & { role?: string };
  reactionCounts: ReactionCounts;
  userReaction: ReactionType | null;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
}
