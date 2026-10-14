import type { Difficulty, RecipeStatus } from '@/shared/types';

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
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: Difficulty;
  originRegion: string;
  coverImageUrl: string | null;
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
  originRegion: string;
  coverImageUrl: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'PENDING_REVIEW';
  instructions: { stepNumber: number; instruction: string }[];
  ingredients: { ingredientName: string; quantity: string; unit: string }[];
}

// Lo que GET /recipes/:id devuelve y el formulario necesita para editar
export interface EditableRecipe {
  id: string;
  title: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: Difficulty;
  originRegion: string;
  coverImageUrl: string | null;
  status: RecipeStatus;
  reviewNotes?: string | null;
  author: { id: string };
  ingredients: { name: string; quantity: string; unit: string }[];
  steps: { stepNumber: number; instruction: string }[];
}

// Respuesta de POST /media/recipe-images
export interface ImageUploadTicket {
  uploadUrl: string;
  publicUrl: string;
  expiresInSeconds: number;
}
