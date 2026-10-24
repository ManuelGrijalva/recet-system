'use client';

import React from 'react';
import { Notice } from '@/shared/components/ui/Notice';
import { usePendingRecipes } from '../hooks/usePendingRecipes';
import { PendingRecipeCard } from './PendingRecipeCard';
import { SkeletonList } from '@/shared/components/ui/Skeleton';
import { EmptyState } from '@/shared/components/ui/EmptyState';

export function PendingRecipesPanel(): React.JSX.Element {
  const { recipes, isLoading, error, reviewingId, review } = usePendingRecipes();

  return (
    <div className="space-y-4">
      {error && (
        <Notice tone="danger" role="alert">{error}</Notice>
      )}

      {isLoading ? (
        <SkeletonList rows={3} label="Cargando recetas pendientes" />
      ) : recipes.length === 0 ? (
        !error && (
          <EmptyState title="Todo al día" description="No hay recetas pendientes de revisión." />
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
