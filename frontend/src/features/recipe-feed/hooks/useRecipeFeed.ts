'use client';

import { useCallback, useEffect, useState } from 'react';
import { getRecipeFeed } from '../api/getRecipeFeed';
import { getFollowingFeed } from '../api/getFollowingFeed';
import type { FeedMode, FeedRecipe, RecipeFeedQuery } from '../types';

interface UseRecipeFeedResult {
  recipes: FeedRecipe[];
  total: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useRecipeFeed(query: RecipeFeedQuery = {}, mode: FeedMode = 'all'): UseRecipeFeedResult {
  const { page = 1, limit = 10 } = query;

  const [recipes, setRecipes] = useState<FeedRecipe[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    (mode === 'following' ? getFollowingFeed : getRecipeFeed)({ page, limit })
      .then((data) => {
        if (!active) return;
        setRecipes(data.items);
        setTotal(data.total);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'No se pudo cargar el feed');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, limit, mode]);

  useEffect(() => load(), [load]);

  return {
    recipes,
    total,
    isLoading,
    error,
    refetch: load,
  };
}
