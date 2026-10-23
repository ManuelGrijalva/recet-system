import type { CreateRecipePayload, RecipeDraft } from '../types';

// Traduce el borrador del formulario al cuerpo que espera POST /recipes
export function buildCreateRecipePayload(
  draft: RecipeDraft,
): CreateRecipePayload {
  return {
    title: draft.title.trim(),
    description: draft.description.trim(),
    prepTimeMinutes: draft.prepTimeMinutes,
    cookTimeMinutes: draft.cookTimeMinutes,
    servings: draft.servings,
    difficulty: draft.difficulty,
    originRegion: draft.originRegion.trim() || 'Jutiapa',
    coverImageUrl: draft.images[0] ?? null,
    galleryImageUrls: draft.images.slice(1),
    status: draft.status,
    instructions: draft.steps.map((step) => ({
      stepNumber: step.stepNumber,
      instruction: step.instruction.trim(),
    })),
    ingredients: draft.ingredients.map((ing) => ({
      ingredientName: ing.name.trim(),
      quantity: ing.quantity.trim(),
      unit: ing.unit.trim(),
    })),
  };
}
