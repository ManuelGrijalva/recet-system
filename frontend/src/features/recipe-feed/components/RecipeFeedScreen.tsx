'use client';

import React from 'react';
import { useRecipeFeed } from '../hooks/useRecipeFeed';
import { FeedHeader } from './FeedHeader';
import { RecipeCard } from './RecipeCard';

export function RecipeFeedScreen(): React.JSX.Element {
  const { recipes, isLoading, error } = useRecipeFeed();

  return (
    <div className="space-y-6">
      <FeedHeader />

      {error && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{error}</p>
      )}

      {isLoading ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Cargando recetas de la comunidad...
        </p>
      ) : (
        <div className="space-y-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
