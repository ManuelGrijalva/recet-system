'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/shared/lib/apiClient';
import { getPendingRecipes } from '../api/getPendingRecipes';
import { reviewRecipe } from '../api/reviewRecipe';
import type { PendingRecipe, ReviewDecision } from '../types';

interface UsePendingRecipesResult {
  recipes: PendingRecipe[];
  isLoading: boolean;
  error: string | null;
  reviewingId: string | null;
  review: (recipeId: string, decision: ReviewDecision) => Promise<boolean>;
}

function describeError(err: unknown): string {
  if (err instanceof ApiError && err.status === 401) {
    return 'Inicia sesión con una cuenta de administrador para validar recetas.';
  }
  if (err instanceof ApiError && err.status === 403) {
    return 'Esta sección es exclusiva del administrador de contenido.';
  }
  return err instanceof Error ? err.message : 'No se pudo completar la operación.';
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
        if (active) setError(describeError(err));
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
        setError(describeError(err));
        return false;
      } finally {
        setReviewingId(null);
      }
    },
    [],
  );

  return { recipes, isLoading, error, reviewingId, review };
}
