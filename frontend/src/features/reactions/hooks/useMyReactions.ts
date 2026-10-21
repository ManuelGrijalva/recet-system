'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/shared/session';
import { getMyReactions } from '../api/getMyReactions';
import type { ReactionType } from '../types';

// Mapa receta -> reaccion propia; vacio para invitados o si falla la red
export function useMyReactions(recipeIds: string[]): Record<string, ReactionType> {
  const { status } = useSession();
  const [reactions, setReactions] = useState<Record<string, ReactionType>>({});
  const key = recipeIds.join(',');

  useEffect(() => {
    if (status !== 'authenticated' || !key) return;
    let active = true;
    getMyReactions(key.split(','))
      .then((data) => {
        if (active) setReactions(data);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [status, key]);

  return reactions;
}
