'use client';

import React, { useState } from 'react';
import { ChatIcon } from '@/shared/components/ui/icons';
import { cn } from '@/shared/lib/utils';
import { ReactionButtons, type ReactionType } from '@/features/reactions';
import { InlineComments } from '@/features/comments';
import { ShareRecipeButton } from '@/features/recipe-share';
import type { ReactionCounts } from '@/shared/types';

interface RecipeCardActionsProps {
  recipeId: string;
  title: string;
  reactionCounts: ReactionCounts;
  commentsCount: number;
  userReaction: ReactionType | null;
}

// Barra de la tarjeta al estilo de una red social: reaccionar, comentar y compartir sin salir del feed
export function RecipeCardActions({
  recipeId,
  title,
  reactionCounts,
  commentsCount,
  userReaction,
}: RecipeCardActionsProps): React.JSX.Element {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="border-t border-zinc-100 dark:border-zinc-900">
      <div className="px-3 py-2.5 flex flex-wrap items-center justify-between gap-2">
        {/* La clave remonta el grupo cuando llega la reaccion propia del servidor */}
        <ReactionButtons
          key={userReaction ?? 'none'}
          recipeId={recipeId}
          initialStats={reactionCounts}
          initialUserReaction={userReaction}
          compact
        />

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowComments((open) => !open)}
            aria-expanded={showComments}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors',
              showComments
                ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900',
            )}
          >
            <ChatIcon className="w-4 h-4" />
            <span>
              <span className="hidden sm:inline">Comentar </span>
              {commentsCount}
            </span>
          </button>
          <ShareRecipeButton recipeId={recipeId} title={title} />
        </div>
      </div>

      {showComments && (
        <div className="px-4 pb-4 pt-1">
          <InlineComments recipeId={recipeId} />
        </div>
      )}
    </div>
  );
}
