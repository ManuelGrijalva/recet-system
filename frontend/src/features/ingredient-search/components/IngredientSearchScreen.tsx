'use client';

import React from 'react';
import { useIngredientSearch } from '../hooks/useIngredientSearch';
import { COMMON_JUTIAPA_INGREDIENTS } from '../lib/commonIngredients';
import { CustomIngredientForm } from './CustomIngredientForm';
import { IngredientChips } from './IngredientChips';
import { MatchResultList } from './MatchResultList';

export function IngredientSearchScreen(): React.JSX.Element {
  const { results, isSelected, toggle, addCustom } = useIngredientSearch();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          Búsqueda inteligente por ingredientes
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Selecciona los ingredientes que tienes en tu cocina para saber qué recetas tradicionales puedes preparar de inmediato.
        </p>
      </div>

      <CustomIngredientForm onAdd={addCustom} />

      <IngredientChips
        options={COMMON_JUTIAPA_INGREDIENTS}
        isSelected={isSelected}
        onToggle={toggle}
      />

      <MatchResultList results={results} />
    </div>
  );
}
