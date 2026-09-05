import React from 'react';
import type { RecipeIngredient } from '../types';

interface IngredientChecklistProps {
  ingredients: RecipeIngredient[];
}

export function IngredientChecklist({
  ingredients,
}: IngredientChecklistProps): React.JSX.Element {
  return (
    <div className="p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] space-y-3">
      <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
        Ingredientes requeridos
      </h2>
      <ul className="divide-y divide-zinc-100 dark:divide-zinc-900 text-xs">
        {ingredients.map((ing, idx) => (
          <li key={idx} className="py-2 flex items-center justify-between">
            <span className="text-zinc-800 dark:text-zinc-200 font-medium">
              {ing.name}
            </span>
            <span className="text-zinc-500 dark:text-zinc-400">
              {ing.quantity} {ing.unit}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
