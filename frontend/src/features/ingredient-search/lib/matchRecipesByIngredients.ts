import type { CatalogRecipe, MatchedRecipe } from '../types';

function has(selected: string[], ingredient: string): boolean {
  return selected.some((s) => s.toLowerCase() === ingredient.toLowerCase());
}

// Respaldo offline de searchRecipesByIngredients cuando el backend no responde.
export function matchRecipesByIngredients(
  catalog: CatalogRecipe[],
  selectedIngredients: string[],
): MatchedRecipe[] {
  return catalog
    .map((recipe) => {
      const matched = recipe.required.filter((ing) =>
        has(selectedIngredients, ing),
      );
      const missing = recipe.required.filter(
        (ing) => !has(selectedIngredients, ing),
      );

      return {
        id: recipe.id,
        title: recipe.title,
        region: recipe.region,
        matchPercentage: Math.round(
          (matched.length / recipe.required.length) * 100,
        ),
        matchedIngredients: matched,
        missingIngredients: missing,
      };
    })
    .filter((r) => r.matchPercentage > 0)
    .sort((a, b) => b.matchPercentage - a.matchPercentage);
}
