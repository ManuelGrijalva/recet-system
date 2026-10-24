'use client';

import React, { useState } from 'react';
import { useSession } from '@/shared/session';
import { useMyReactions } from '@/features/reactions';
import { useMyBookmarks } from '@/features/saved-recipes';
import { useRecipeFeed } from '../hooks/useRecipeFeed';
import type { FeedMode } from '../types';
import { FeedHeader } from './FeedHeader';
import { CommunityCooks } from './CommunityCooks';
import { FeedWelcome } from './FeedWelcome';
import { RecipeCard } from './RecipeCard';
import { RecipeCardSkeleton, LoadingRegion } from '@/shared/components/ui/Skeleton';
import { EmptyState } from '@/shared/components/ui/EmptyState';

export function RecipeFeedScreen(): React.JSX.Element {
  const { status } = useSession();
  const [mode, setMode] = useState<FeedMode>('all');
  const { recipes, isLoading, error } = useRecipeFeed({}, mode);
  const myReactions = useMyReactions(recipes.map((r) => r.id));
  const myBookmarks = useMyBookmarks();

  return (
    <div className="space-y-6">
      {status === 'guest' && <FeedWelcome recipes={recipes} />}
      <FeedHeader mode={mode} canFollow={status === 'authenticated'} onModeChange={setMode} />
      {!isLoading && <CommunityCooks recipes={recipes} />}

      {error && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{error}</p>
      )}

      {isLoading ? (
        <LoadingRegion label="Cargando recetas de la comunidad" className="space-y-6">
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
        </LoadingRegion>
      ) : mode === 'following' && recipes.length === 0 && !error ? (
        <EmptyState
          title="Tu cocina aún está en silencio"
          description="Aún no sigues a ningún cocinero, o no han publicado recetas. Toca el nombre de un autor en Todas para ver su perfil y seguirlo."
        />
      ) : (
        <div className="space-y-6">
          {recipes.map((recipe, index) => (
            <div key={recipe.id} className="animate-rise-in" style={{ animationDelay: `${Math.min(index, 4) * 50}ms` }}>
              <RecipeCard recipe={recipe} userReaction={myReactions[recipe.id] ?? null} isBookmarked={myBookmarks.has(recipe.id)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
