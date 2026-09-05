/**
 * Receta del catálogo con la lista de ingredientes que requiere. Es la base
 * sobre la que corre el algoritmo de coincidencia (numeral 3.4.2 de
 * `Entrega I part2.md`).
 */
export interface CatalogRecipe {
  id: string;
  title: string;
  region: string;
  required: string[];
}

/** Resultado del match para una receta, listo para pintar. */
export interface MatchedRecipe {
  id: string;
  title: string;
  region: string;
  matchPercentage: number;
  matchedIngredients: string[];
  missingIngredients: string[];
}
