import React from 'react';
import { MatchResultCard } from './MatchResultCard';
import type { MatchedRecipe } from '../types';
import { SkeletonList, LoadingRegion } from '@/shared/components/ui/Skeleton';
import { EmptyState } from '@/shared/components/ui/EmptyState';

interface MatchResultListProps {
  results: MatchedRecipe[];
  isLoading?: boolean;
}

export function MatchResultList({
  results,
  isLoading = false,
}: MatchResultListProps): React.JSX.Element {
  return (
    <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          Recetas sugeridas ({results.length})
        </h2>
        {/* Anuncia el resultado a lectores de pantalla cada vez que cambia */}
        <p role="status" className="sr-only">
          {isLoading ? 'Buscando recetas' : `Encontramos ${results.length} ${results.length === 1 ? 'receta' : 'recetas'}`}
        </p>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          Ordenadas por coincidencia
        </span>
      </div>

      {isLoading ? (
        <LoadingRegion label="Buscando recetas" className="space-y-3">
          <SkeletonList rows={3} />
        </LoadingRegion>
      ) : results.length === 0 ? (
        <EmptyState
          title="Sin coincidencias por ahora"
          description="No encontramos recetas con esos ingredientes. Prueba agregando otros o quitando alguno."
        />
      ) : (
        <div className="space-y-3">
          {results.map((recipe, index) => (
            <div key={recipe.id} className="animate-rise-in" style={{ animationDelay: `${Math.min(index, 4) * 40}ms` }}>
              <MatchResultCard recipe={recipe} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
