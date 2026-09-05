'use client';

import { useEffect, useMemo, useState } from 'react';
import { getRecipeCatalog } from '../api/getRecipeCatalog';
import { matchRecipesByIngredients } from '../lib/matchRecipesByIngredients';
import type { CatalogRecipe, MatchedRecipe } from '../types';

const DEFAULT_SELECTION = ['Harina de arroz', 'Crema fresca de vaca'];

interface UseIngredientSearchResult {
  selected: string[];
  results: MatchedRecipe[];
  isSelected: (name: string) => boolean;
  toggle: (name: string) => void;
  addCustom: (name: string) => void;
}

export function useIngredientSearch(): UseIngredientSearchResult {
  const [catalog, setCatalog] = useState<CatalogRecipe[]>([]);
  const [selected, setSelected] = useState<string[]>(DEFAULT_SELECTION);

  useEffect(() => {
    let active = true;
    getRecipeCatalog().then((data) => {
      if (active) setCatalog(data);
    });
    return () => {
      active = false;
    };
  }, []);

  const results = useMemo(
    () => matchRecipesByIngredients(catalog, selected),
    [catalog, selected],
  );

  const isSelected = (name: string) => selected.includes(name);

  const toggle = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name],
    );
  };

  const addCustom = (name: string) => {
    const clean = name.trim();
    if (!clean) return;
    setSelected((prev) => (prev.includes(clean) ? prev : [...prev, clean]));
  };

  return { selected, results, isSelected, toggle, addCustom };
}
