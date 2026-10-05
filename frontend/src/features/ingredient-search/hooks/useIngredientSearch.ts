'use client';

import { useEffect, useState } from 'react';
import { searchRecipesByIngredients } from '../api/searchRecipesByIngredients';
import type { MatchedRecipe } from '../types';

const DEFAULT_SELECTION = ['Harina de arroz', 'Crema fresca de vaca'];

interface UseIngredientSearchResult {
  selected: string[];
  results: MatchedRecipe[];
  isLoading: boolean;
  isSelected: (name: string) => boolean;
  toggle: (name: string) => void;
  addCustom: (name: string) => void;
}

export function useIngredientSearch(): UseIngredientSearchResult {
  const [selected, setSelected] = useState<string[]>(DEFAULT_SELECTION);
  const [results, setResults] = useState<MatchedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let active = true;

    if (selected.length === 0) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    searchRecipesByIngredients(selected).then((data) => {
      if (!active) return;
      setResults(data);
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, [selected]);

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

  return { selected, results, isLoading, isSelected, toggle, addCustom };
}
