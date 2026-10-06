'use client';

import { useCallback, useEffect, useState } from 'react';
import { getPendingRecipes } from '../api/getPendingRecipes';
import { reviewRecipe } from '../api/reviewRecipe';
import { describeModerationError } from '../lib/describeModerationError';
import type { PendingRecipe, ReviewDecision } from '../types';

interface UsePendingRecipesResult {
  recipes: PendingRecipe[];
  isLoading: boolean;
  error: string | null;
  reviewingId: string | null;
  review: (recipeId: string, decision: ReviewDecision) => Promise<boolean>;
}

export function usePendingRecipes(): UsePendingRecipesResult {
  const [recipes, setRecipes] = useState<PendingRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getPendingRecipes()
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
  }, []);

  const review = useCallback(
    async (recipeId: string, decision: ReviewDecision): Promise<boolean> => {
      setReviewingId(recipeId);
      setError(null);

      try {
        await reviewRecipe(recipeId, decision);
        setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
        return true;
      } catch (err) {
        setError(describeModerationError(err));
        return false;
      } finally {
        setReviewingId(null);
      }
    },
    [],
  );

  return { recipes, isLoading, error, reviewingId, review };
}
