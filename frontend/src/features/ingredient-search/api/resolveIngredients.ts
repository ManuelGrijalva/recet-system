import { apiClient } from '@/shared/lib/apiClient';
import { withFallback } from '@/shared/lib/withFallback';
import type { IngredientResolution } from '../types';

// GET /ingredients/resolve: traduce sinonimos, plurales y errores al nombre oficial.
// Sin conexion se acepta tal cual y la busqueda local hace su mejor esfuerzo.
export function resolveIngredient(term: string): Promise<IngredientResolution> {
  return withFallback(
    async () => {
      const [first] = await apiClient<IngredientResolution[]>('ingredients/resolve', {
        params: { terms: term },
      });
      return first;
    },
    (): IngredientResolution => ({ input: term, matches: [term.trim().toLowerCase()], via: 'exact' }),
  );
}
