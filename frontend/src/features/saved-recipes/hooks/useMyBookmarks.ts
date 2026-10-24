'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/shared/session';
import { getSavedRecipes } from '../api/getSavedRecipes';

// Ids de las recetas guardadas por el usuario; vacio para invitados o si falla la red
export function useMyBookmarks(): Set<string> {
  const { status } = useSession();
  const [ids, setIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (status !== 'authenticated') return;
    let active = true;
    getSavedRecipes()
      .then((recipes) => {
        if (active) setIds(new Set(recipes.map((recipe) => recipe.id)));
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [status]);

  return ids;
}
