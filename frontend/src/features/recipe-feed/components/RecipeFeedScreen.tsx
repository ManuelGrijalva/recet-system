'use client';

import React, { useState } from 'react';
import { useSession } from '@/shared/session';
import { useRecipeFeed } from '../hooks/useRecipeFeed';
import type { FeedMode } from '../types';
import { FeedHeader } from './FeedHeader';
import { RecipeCard } from './RecipeCard';

export function RecipeFeedScreen(): React.JSX.Element {
  const { status } = useSession();
  const [mode, setMode] = useState<FeedMode>('all');
  const { recipes, isLoading, error } = useRecipeFeed({}, mode);

  return (
    <div className="space-y-6">
      <FeedHeader mode={mode} canFollow={status === 'authenticated'} onModeChange={setMode} />

      {error && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{error}</p>
      )}

      {isLoading ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Cargando recetas de la comunidad...
        </p>
      ) : mode === 'following' && recipes.length === 0 && !error ? (
        <div className="rounded-md border border-dashed border-zinc-200 dark:border-zinc-800 p-8 text-center">
          <p className="text-xs text-zinc-500">
            Aún no sigues a ningún cocinero, o no han publicado recetas. Toca el nombre de un autor para ver su perfil y seguirlo.
          </p>
        </div>
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
