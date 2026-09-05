'use client';

import { useEffect, useState } from 'react';
import { getSavedRecipes } from '../api/getSavedRecipes';
import type { SavedRecipe } from '../types';

interface UseSavedRecipesResult {
  recipes: SavedRecipe[];
  isLoading: boolean;
}

export function useSavedRecipes(): UseSavedRecipesResult {
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getSavedRecipes()
      .then((data) => {
        if (active) setRecipes(data);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { recipes, isLoading };
}
