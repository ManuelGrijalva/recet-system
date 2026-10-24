'use client';

import React from 'react';
import { RecipeTile, RecipeTileGrid } from '@/shared/components/ui/RecipeTile';
import { TextileBand } from '@/shared/components/ui/TextileBand';
import { useRelatedRecipes } from '../hooks/useRelatedRecipes';

interface RelatedRecipesProps {
  recipeId: string;
  region: string;
}

// Otras recetas del mismo lugar, en cuadricula con foto, para seguir explorando
export function RelatedRecipes({ recipeId, region }: RelatedRecipesProps): React.JSX.Element | null {
  const recipes = useRelatedRecipes(region, recipeId);
  if (recipes.length === 0) return null;

  return (
    <section aria-labelledby="related-title" className="space-y-3">
      <div>
        <h2 id="related-title" className="font-serif text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          Más recetas de {region}
        </h2>
        <TextileBand scale={0.375} className="mt-2 rounded-sm" />
      </div>
      <RecipeTileGrid>
        {recipes.map((recipe, index) => (
          <RecipeTile
            key={recipe.id}
            id={recipe.id}
            title={recipe.title}
            coverImageUrl={recipe.coverImageUrl}
            coverImageCredit={recipe.coverImageCredit}
            coverImageCreditUrl={recipe.coverImageCreditUrl}
            meta={`${recipe.prepTimeMinutes + recipe.cookTimeMinutes} min`}
            index={index}
          />
        ))}
      </RecipeTileGrid>
    </section>
  );
}
