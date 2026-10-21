'use client';

import { useCallback, useEffect, useState } from 'react';
import { getIngredientCatalog } from '../api/getIngredientCatalog';
import { resolveIngredient } from '../api/resolveIngredients';
import { searchRecipesByIngredients } from '../api/searchRecipesByIngredients';
import { capitalizeIngredientName } from '../lib/capitalizeIngredientName';
import type { CatalogIngredient, MatchedRecipe } from '../types';

const QUICK_PICK_COUNT = 16;

interface UseIngredientSearchResult {
  selected: string[];
  quickPicks: string[];
  catalog: CatalogIngredient[];
  results: MatchedRecipe[];
  isLoading: boolean;
  isAdding: boolean;
  notice: string | null;
  isSelected: (name: string) => boolean;
  toggle: (name: string) => void;
  remove: (name: string) => void;
  addCustom: (name: string) => Promise<void>;
}

const quote = (text: string): string => `«${text}»`;

// Mensaje que explica como se interpreto lo escrito
function describeResolution(input: string, matches: string[], via: string): string | null {
  const names = matches.map(capitalizeIngredientName).join(', ');
  if (via === 'synonym' || via === 'typo') return `Buscamos ${quote(names)} por lo que escribiste: ${quote(input)}.`;
  if (via === 'family') return `${quote(input)} incluye: ${names}.`;
  return null;
}

export function useIngredientSearch(): UseIngredientSearchResult {
  const [selected, setSelected] = useState<string[]>([]);
  const [catalog, setCatalog] = useState<CatalogIngredient[]>([]);
  const [results, setResults] = useState<MatchedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void getIngredientCatalog().then((data) => {
      if (active) setCatalog(data);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    if (selected.length === 0) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    void searchRecipesByIngredients(selected).then((data) => {
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
    setNotice(null);
    setSelected((prev) => (prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]));
  };

  const remove = (name: string) => setSelected((prev) => prev.filter((i) => i !== name));

  // Solo se agregan nombres del catalogo oficial (regla de negocio b)
  const addCustom = useCallback(async (name: string) => {
    const clean = name.trim();
    if (!clean) return;
    setIsAdding(true);
    try {
      const resolution = await resolveIngredient(clean);
      if (resolution.matches.length === 0) {
        setNotice(`No encontramos ${quote(clean)} en el catálogo de ingredientes. Revisa cómo se escribe o prueba con otro nombre.`);
        return;
      }
      setNotice(describeResolution(clean, resolution.matches, resolution.via));
      setSelected((prev) => [...prev, ...resolution.matches.filter((m) => !prev.includes(m))]);
    } finally {
      setIsAdding(false);
    }
  }, []);

  return {
    selected,
    quickPicks: catalog.slice(0, QUICK_PICK_COUNT).map((c) => c.name),
    catalog,
    results,
    isLoading,
    isAdding,
    notice,
    isSelected,
    toggle,
    remove,
    addCustom,
  };
}
