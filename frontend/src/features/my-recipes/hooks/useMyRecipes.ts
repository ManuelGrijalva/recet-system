'use client';

import { useCallback, useEffect, useState } from 'react';
import { deleteRecipe } from '../api/deleteRecipe';
import { getMyRecipes } from '../api/getMyRecipes';
import type { MyRecipe } from '../types';

interface UseMyRecipesResult {
  recipes: MyRecipe[];
  isLoading: boolean;
  error: string | null;
  deletingId: string | null;
  remove: (recipeId: string) => Promise<void>;
}

export function useMyRecipes(): UseMyRecipesResult {
  const [recipes, setRecipes] = useState<MyRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getMyRecipes()
      .then((data) => {
        if (active) setRecipes(data);
      })
      .catch(() => {
        if (active) setError('No se pudieron cargar tus recetas.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const remove = useCallback(async (recipeId: string) => {
    setDeletingId(recipeId);
    setError(null);
    try {
      await deleteRecipe(recipeId);
      setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
    } catch {
      setError('No se pudo eliminar la receta. Intenta de nuevo.');
    } finally {
      setDeletingId(null);
    }
  }, []);

  return { recipes, isLoading, error, deletingId, remove };
}
