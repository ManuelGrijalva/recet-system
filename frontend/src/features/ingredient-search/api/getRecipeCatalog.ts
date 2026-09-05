import type { CatalogRecipe } from '../types';
import { recipeCatalogMock } from './recipeCatalog.mock';

/**
 * Catálogo de recetas con sus ingredientes requeridos, insumo del algoritmo
 * de coincidencia local.
 *
 * TODO(backend): `GET /recipes/search` hoy resuelve el match en el servidor y
 * devuelve `FeedRecipeItem[]` sin la lista `required`. Cuando exista un
 * endpoint que exponga receta -> ingredientes del catálogo, reemplazar este
 * seed por esa llamada (con `withFallback`).
 */
export function getRecipeCatalog(): Promise<CatalogRecipe[]> {
  return Promise.resolve(recipeCatalogMock);
}
