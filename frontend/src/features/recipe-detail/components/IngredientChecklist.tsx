'use client';

import React, { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import type { RecipeIngredient } from '../types';

interface IngredientChecklistProps {
  ingredients: RecipeIngredient[];
}

// Lista para ir marcando lo que ya se tiene en la cocina; el estado vive solo en la pantalla
export function IngredientChecklist({
  ingredients,
}: IngredientChecklistProps): React.JSX.Element {
  const [checked, setChecked] = useState<Set<number>>(() => new Set());
  const ready = checked.size;

  const toggle = (index: number): void => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <section className="space-y-3 rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#1c1712]">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-serif text-lg font-semibold text-zinc-950 dark:text-zinc-50">Ingredientes</h2>
        <p data-print="hide" className="text-xs text-zinc-500 dark:text-zinc-400" aria-live="polite">
          {ready > 0 ? `${ready} de ${ingredients.length} listos` : 'Toca para marcar los que ya tienes'}
        </p>
      </div>

      <ul className="divide-y divide-zinc-100 dark:divide-zinc-900">
        {ingredients.map((ing, idx) => {
          const isChecked = checked.has(idx);
          return (
            <li key={idx}>
              <label className="flex min-h-11 cursor-pointer items-center gap-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggle(idx)}
                  className="h-5 w-5 shrink-0 cursor-pointer rounded-sm accent-brand"
                />
                <span
                  className={cn(
                    'flex-1 font-medium transition-colors duration-150',
                    isChecked ? 'text-zinc-400 line-through dark:text-zinc-600' : 'text-zinc-800 dark:text-zinc-200',
                  )}
                >
                  {ing.name}
                  {ing.notes && <span className="block text-xs font-normal text-zinc-500 dark:text-zinc-400">{ing.notes}</span>}
                </span>
                <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                  {ing.quantity} {ing.unit}
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      {ready > 0 && (
        <button
          type="button"
          onClick={() => setChecked(new Set())}
          className="text-xs font-medium text-zinc-600 underline-offset-2 hover:underline dark:text-zinc-400"
        >
          Desmarcar todo
        </button>
      )}
    </section>
  );
}
