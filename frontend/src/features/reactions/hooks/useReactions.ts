'use client';

import { useCallback, useState } from 'react';
import type { ReactionCounts } from '@/shared/types';
import { toggleReaction } from '../api/toggleReaction';
import { applyReaction } from '../lib/applyReaction';
import type { ReactionType } from '../types';

interface UseReactionsParams {
  recipeId: string;
  initialStats: ReactionCounts;
  initialUserReaction?: ReactionType | null;
}

interface UseReactionsResult {
  stats: ReactionCounts;
  userReaction: ReactionType | null;
  isPending: boolean;
  toggle: (type: ReactionType) => void;
}

/**
 * Estado optimista de reacciones para una receta. La regla de negocio del
 * toggle vive en `applyReaction` (pura y testeable); aquí solo se orquesta
 * el update inmediato + rollback ante error de red.
 */
export function useReactions({
  recipeId,
  initialStats,
  initialUserReaction = null,
}: UseReactionsParams): UseReactionsResult {
  const [state, setState] = useState({
    stats: initialStats,
    userReaction: initialUserReaction,
  });
  const [isPending, setIsPending] = useState(false);

  const toggle = useCallback(
    (type: ReactionType) => {
      if (isPending) return;

      const previous = state;
      const next = applyReaction(state, type);

      setState(next);
      setIsPending(true);

      toggleReaction(recipeId, type)
        .catch(() => setState(previous))
        .finally(() => setIsPending(false));
    },
    [recipeId, state, isPending],
  );

  return {
    stats: state.stats,
    userReaction: state.userReaction,
    isPending,
    toggle,
  };
}
