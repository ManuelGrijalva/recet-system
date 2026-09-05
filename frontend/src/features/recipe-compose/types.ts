import type { Difficulty } from '@/shared/types';

export type ComposeStatus = 'DRAFT' | 'PUBLISHED';

export interface IngredientDraft {
  name: string;
  quantity: string;
  unit: string;
}

export interface StepDraft {
  stepNumber: number;
  instruction: string;
}

export interface RecipeDraft {
  title: string;
  description: string;
  timeMinutes: number;
  servings: number;
  difficulty: Difficulty;
  status: ComposeStatus;
  ingredients: IngredientDraft[];
  steps: StepDraft[];
}

/**
 * Cuerpo que espera `POST /recipes` (CreateRecipeDto del backend).
 * El slice traduce su `RecipeDraft` a esta forma antes de enviarlo.
 */
export interface CreateRecipePayload {
  title: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: Difficulty;
  status: 'DRAFT' | 'PUBLISHED' | 'PENDING_REVIEW';
  instructions: { stepNumber: number; instruction: string }[];
  ingredients: { ingredientName: string; quantity: string; unit: string }[];
}
