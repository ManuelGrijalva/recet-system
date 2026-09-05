'use client';

import { useEffect, useState } from 'react';
import { getRecipeDetail } from '../api/getRecipeDetail';
import type { RecipeDetail } from '../types';

interface UseRecipeDetailResult {
  recipe: RecipeDetail | null;
  isLoading: boolean;
  error: string | null;
}

export function useRecipeDetail(id: string): UseRecipeDetailResult {
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    getRecipeDetail(id)
      .then((data) => {
        if (active) setRecipe(data);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : 'No se pudo cargar la receta',
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  return { recipe, isLoading, error };
}
