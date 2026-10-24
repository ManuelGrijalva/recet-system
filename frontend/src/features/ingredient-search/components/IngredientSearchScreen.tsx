'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useIngredientSearch } from '../hooks/useIngredientSearch';
import { CustomIngredientForm } from './CustomIngredientForm';
import { IngredientChips } from './IngredientChips';
import { MatchResultList } from './MatchResultList';
import { SelectedIngredients } from './SelectedIngredients';
import { TextileBand } from '@/shared/components/ui/TextileBand';

export function IngredientSearchScreen(): React.JSX.Element {
  const { selected, quickPicks, catalog, results, isLoading, isAdding, notice, isSelected, toggle, remove, addCustom } =
    useIngredientSearch();
  const resultsRef = useRef<HTMLDivElement>(null);
  const [resultsVisible, setResultsVisible] = useState(false);
  const hasResults = selected.length > 0 && !isLoading && results.length > 0;

  // En el celular los resultados quedan abajo: si no estan a la vista, una barra lleva hasta ellos
  useEffect(() => {
    const node = resultsRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setResultsVisible(entry.isIntersecting), { rootMargin: '0px 0px -30% 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasResults]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          Búsqueda inteligente por ingredientes
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Escribe o elige los ingredientes que tienes en tu cocina para saber qué recetas tradicionales puedes preparar. Entendemos nombres regionales, plurales y pequeños errores de escritura.
        </p>
        <TextileBand scale={0.375} className="mt-3 rounded-sm" />
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

      <div ref={resultsRef} className="scroll-mt-20">
        {selected.length > 0 && <MatchResultList results={results} isLoading={isLoading} />}
      </div>

      {hasResults && !resultsVisible && (
        <button
          type="button"
          onClick={() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          className="fixed inset-x-4 bottom-[4.5rem] z-30 flex min-h-11 items-center justify-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-brand-foreground shadow-lg animate-rise-in active:scale-[0.97] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 md:hidden"
        >
          Ver {results.length} {results.length === 1 ? 'receta sugerida' : 'recetas sugeridas'}
          <span aria-hidden="true">↓</span>
        </button>
      )}
    </div>
  );
}
