import React from 'react';
import { MatchResultCard } from './MatchResultCard';
import type { MatchedRecipe } from '../types';

interface MatchResultListProps {
  results: MatchedRecipe[];
}

export function MatchResultList({
  results,
}: MatchResultListProps): React.JSX.Element {
  return (
    <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
          Recetas sugeridas ({results.length})
        </h2>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          Ordenadas por coincidencia
        </span>
      </div>

      {results.length === 0 ? (
        <div className="rounded-md border border-dashed border-zinc-200 dark:border-zinc-800 p-8 text-center">
          <p className="text-xs text-zinc-500">
            No encontramos recetas que coincidan con los ingredientes seleccionados. Prueba agregando otros insumos.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((recipe) => (
            <MatchResultCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
