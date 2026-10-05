import { apiClient } from '@/shared/lib/apiClient';
import { withFallback } from '@/shared/lib/withFallback';
import { matchRecipesByIngredients } from '../lib/matchRecipesByIngredients';
import { capitalizeIngredientName } from '../lib/capitalizeIngredientName';
import { recipeCatalogMock } from './recipeCatalog.mock';
import type { MatchedRecipe } from '../types';

// Subconjunto de FeedRecipeItem del backend que interesa aqui.
interface SearchApiRecipe {
  id: string;
  title: string;
  originRegion: string;
  matchPercentage?: number;
  matchedIngredientNames?: string[];
  missingIngredientNames?: string[];
}

function toMatchedRecipe(item: SearchApiRecipe): MatchedRecipe {
  return {
    id: item.id,
    title: item.title,
    region: item.originRegion,
    matchPercentage: item.matchPercentage ?? 0,
    matchedIngredients: (item.matchedIngredientNames ?? []).map(
      capitalizeIngredientName,
    ),
    missingIngredients: (item.missingIngredientNames ?? []).map(
      capitalizeIngredientName,
    ),
  };
}

// GET /recipes/search: motor de busqueda por ingredientes. Cae al match
// local contra el catalogo semilla si el backend no responde.
export function searchRecipesByIngredients(
  selectedIngredients: string[],
): Promise<MatchedRecipe[]> {
  if (selectedIngredients.length === 0) {
    return Promise.resolve([]);
  }

  return withFallback(
    async () => {
      const data = await apiClient<SearchApiRecipe[]>('recipes/search', {
        params: { ingredients: selectedIngredients.join(',') },
      });
      return data.map(toMatchedRecipe);
    },
    () => matchRecipesByIngredients(recipeCatalogMock, selectedIngredients),
  );
}
