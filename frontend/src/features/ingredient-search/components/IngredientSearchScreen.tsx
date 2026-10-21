'use client';

import React from 'react';
import { useIngredientSearch } from '../hooks/useIngredientSearch';
import { CustomIngredientForm } from './CustomIngredientForm';
import { IngredientChips } from './IngredientChips';
import { MatchResultList } from './MatchResultList';
import { SelectedIngredients } from './SelectedIngredients';

export function IngredientSearchScreen(): React.JSX.Element {
  const { selected, quickPicks, catalog, results, isLoading, isAdding, notice, isSelected, toggle, remove, addCustom } =
    useIngredientSearch();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          Búsqueda inteligente por ingredientes
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Escribe o elige los ingredientes que tienes en tu cocina para saber qué recetas tradicionales puedes preparar. Entendemos nombres regionales, plurales y pequeños errores de escritura.
        </p>
      </div>

      <CustomIngredientForm
        suggestions={catalog.map((c) => c.name)}
        isAdding={isAdding}
        notice={notice}
        onAdd={addCustom}
      />

      <SelectedIngredients selected={selected} onRemove={remove} />

      <IngredientChips
        options={quickPicks}
        isSelected={isSelected}
        onToggle={toggle}
      />

      {selected.length > 0 && <MatchResultList results={results} isLoading={isLoading} />}
    </div>
  );
}
