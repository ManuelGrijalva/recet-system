import { apiClient } from '@/shared/lib/apiClient';
import type { RecipeDetail } from '../types';
import { recipeDetailFallback, recipeDetailMock } from './recipeDetail.mock';

type RawRecipeDetail = Partial<RecipeDetail> & Pick<RecipeDetail, 'id' | 'title'>;

/**
 * `GET /recipes/:id`.
 *
 * El backend todavía no incluye `ingredients`/`steps`/`userReaction` en el
 * detalle, así que la respuesta real se fusiona con el seed para garantizar
 * que esos campos existan. Si la petición falla, se usa el seed completo.
 */
export async function getRecipeDetail(id: string): Promise<RecipeDetail> {
  const seed = recipeDetailMock[id] ?? recipeDetailFallback;

  try {
    const raw = await apiClient<RawRecipeDetail>(`recipes/${id}`);
    return {
      ...seed,
      ...raw,
      author: { ...seed.author, ...raw.author },
      reactionCounts: raw.reactionCounts ?? seed.reactionCounts,
      userReaction: raw.userReaction ?? null,
      ingredients: raw.ingredients ?? seed.ingredients,
      steps: raw.steps ?? seed.steps,
    };
  } catch {
    return seed;
  }
}
