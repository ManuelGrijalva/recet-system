'use client';

import { useEffect, useState } from 'react';
import { getSavedRecipes } from '../api/getSavedRecipes';
import type { SavedRecipe } from '../types';

interface UseSavedRecipesResult {
  recipes: SavedRecipe[];
  isLoading: boolean;
  error: string | null;
}

export function useSavedRecipes(): UseSavedRecipesResult {
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getSavedRecipes()
      .then((data) => {
        if (active) setRecipes(data);
      })
      .catch(() => {
        if (active) setError('No se pudo cargar tu recetario. Revisa tu conexión e intenta de nuevo.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { recipes, isLoading, error };
}
