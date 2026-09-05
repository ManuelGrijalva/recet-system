'use client';

import React, { useState } from 'react';
import { cn } from '../../shared/lib/utils';
import { apiClient } from '../../shared/lib/apiClient';

export interface ReactionStats {
  like: number;
  yummy: number;
  triedIt: number;
}

interface ReactionButtonsProps {
  recipeId: string;
  initialStats: ReactionStats;
  initialUserReaction?: 'LIKE' | 'YUMMY' | 'TRIED_IT' | null;
}

export function ReactionButtons({
  recipeId,
  initialStats,
  initialUserReaction = null,
}: ReactionButtonsProps): React.JSX.Element {
  const [stats, setStats] = useState<ReactionStats>(initialStats);
  const [userReaction, setUserReaction] = useState<'LIKE' | 'YUMMY' | 'TRIED_IT' | null>(
    initialUserReaction,
  );
  const [isPending, setIsPending] = useState(false);

  const handleToggle = async (type: 'LIKE' | 'YUMMY' | 'TRIED_IT') => {
    if (isPending) return;

    // Snapshot para rollback en caso de fallo
    const previousReaction = userReaction;
    const previousStats = { ...stats };

    // 1. Optimistic Update inmediato
    const nextStats = { ...stats };

    if (userReaction === type) {
      // Remover reaccion
      if (type === 'LIKE') nextStats.like = Math.max(0, nextStats.like - 1);
      if (type === 'YUMMY') nextStats.yummy = Math.max(0, nextStats.yummy - 1);
      if (type === 'TRIED_IT') nextStats.triedIt = Math.max(0, nextStats.triedIt - 1);
      setUserReaction(null);
    } else {
      // Si ya tenia otra reaccion, decrementar la anterior
      if (userReaction === 'LIKE') nextStats.like = Math.max(0, nextStats.like - 1);
      if (userReaction === 'YUMMY') nextStats.yummy = Math.max(0, nextStats.yummy - 1);
      if (userReaction === 'TRIED_IT') nextStats.triedIt = Math.max(0, nextStats.triedIt - 1);

      // Incrementar la nueva
      if (type === 'LIKE') nextStats.like += 1;
      if (type === 'YUMMY') nextStats.yummy += 1;
      if (type === 'TRIED_IT') nextStats.triedIt += 1;
      setUserReaction(type);
    }

    setStats(nextStats);
    setIsPending(true);

    try {
      await apiClient<{ action: string; currentType: string | null }>(
        `interactions/recipes/${recipeId}/reactions`,
        {
          method: 'POST',
          body: JSON.stringify({ type }),
        },
      );
    } catch {
      // Revertir en error
      setUserReaction(previousReaction);
      setStats(previousStats);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex items-center gap-1 sm:gap-1.5">
      {/* 1. LIKE */}
      <button
        type="button"
        onClick={() => handleToggle('LIKE')}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors',
          userReaction === 'LIKE'
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-xs'
            : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900',
        )}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
        <span>Me gusta ({stats.like})</span>
      </button>

      {/* 2. YUMMY */}
      <button
        type="button"
        onClick={() => handleToggle('YUMMY')}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors',
          userReaction === 'YUMMY'
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-xs'
            : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900',
        )}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Delicioso ({stats.yummy})</span>
      </button>

      {/* 3. TRIED IT */}
      <button
        type="button"
        onClick={() => handleToggle('TRIED_IT')}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors',
          userReaction === 'TRIED_IT'
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-xs'
            : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900',
        )}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>La preparé ({stats.triedIt})</span>
      </button>
    </div>
  );
}
