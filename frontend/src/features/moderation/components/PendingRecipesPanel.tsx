'use client';

import React from 'react';
import { usePendingRecipes } from '../hooks/usePendingRecipes';
import { PendingRecipeCard } from './PendingRecipeCard';

export function PendingRecipesPanel(): React.JSX.Element {
  const { recipes, isLoading, error, reviewingId, review } = usePendingRecipes();

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-xs font-medium text-zinc-800 dark:text-zinc-200">
          {error}
        </div>
      )}

      {isLoading ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Cargando recetas pendientes...</p>
      ) : recipes.length === 0 ? (
        !error && (
          <div className="rounded-md border border-dashed border-zinc-200 dark:border-zinc-800 p-8 text-center">
            <p className="text-xs text-zinc-500">No hay recetas pendientes de revisión.</p>
          </div>
        )
      ) : (
        <div className="space-y-3">
          {recipes.map((recipe) => (
            <PendingRecipeCard
              key={recipe.id}
              recipe={recipe}
              isReviewing={reviewingId === recipe.id}
              onReview={(decision) => review(recipe.id, decision)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
