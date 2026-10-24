'use client';

import { useEffect, useState } from 'react';
import { getRelatedRecipes } from '../api/getRelatedRecipes';
import type { RelatedRecipe } from '../types';

export function useRelatedRecipes(region: string, excludeId: string): RelatedRecipe[] {
  const [recipes, setRecipes] = useState<RelatedRecipe[]>([]);

  useEffect(() => {
    let active = true;
    void getRelatedRecipes(region, excludeId).then((data) => {
      if (active) setRecipes(data);
    });
    return () => {
      active = false;
    };
  }, [region, excludeId]);

  return recipes;
}
