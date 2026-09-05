import type { CreateRecipePayload, RecipeDraft } from '../types';

/**
 * Traduce el borrador del formulario al cuerpo que espera `POST /recipes`.
 *
 * El formulario recoge un único "tiempo de preparación"; se mapea a
 * `prepTimeMinutes` y se deja `cookTimeMinutes` en 0 hasta que la UI separe
 * ambos tiempos.
 */
export function buildCreateRecipePayload(
  draft: RecipeDraft,
): CreateRecipePayload {
  return {
    title: draft.title.trim(),
    description: draft.description.trim(),
    prepTimeMinutes: draft.timeMinutes,
    cookTimeMinutes: 0,
    servings: draft.servings,
    difficulty: draft.difficulty,
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
