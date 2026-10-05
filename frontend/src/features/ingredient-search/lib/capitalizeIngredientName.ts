/**
 * El catálogo de ingredientes se guarda normalizado en minúsculas en el
 * backend (`RecipesService.create`). 
 */
export function capitalizeIngredientName(name: string): string {
  return name
    .split(' ')
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(' ');
}
