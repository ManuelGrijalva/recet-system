'use client';

import { useCallback, useEffect, useState } from 'react';
import { deleteRecipe } from '@/features/my-recipes';
import { getPublishedRecipes } from '../api/getPublishedRecipes';
import { describeModerationError } from '../lib/describeModerationError';
import type { PendingRecipe } from '../types';

interface UsePublishedRecipesResult {
  recipes: PendingRecipe[];
  isLoading: boolean;
  error: string | null;
  deletingId: string | null;
  search: (query: string) => void;
  remove: (recipeId: string) => Promise<void>;
}

export function usePublishedRecipes(): UsePublishedRecipesResult {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState<PendingRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    getPublishedRecipes(query)
      .then((data) => {
        if (active) setRecipes(data);
      })
      .catch((err: unknown) => {
        if (active) setError(describeModerationError(err));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [query]);

  const remove = useCallback(async (recipeId: string): Promise<void> => {
    setDeletingId(recipeId);
    setError(null);
    try {
      await deleteRecipe(recipeId);
      setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
    } catch (err) {
      setError(describeModerationError(err));
    } finally {
      setDeletingId(null);
    }
  }, []);

  return { recipes, isLoading, error, deletingId, search: setQuery, remove };
}
