import React from 'react';
import Link from 'next/link';
import type { MatchedRecipe } from '../types';

interface MatchResultCardProps {
  recipe: MatchedRecipe;
}

export function MatchResultCard({
  recipe,
}: MatchResultCardProps): React.JSX.Element {
  return (
    <div className="p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
            {recipe.region}
          </span>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            {recipe.title}
          </h3>
        </div>
        <div className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
          {recipe.matchPercentage}% disponible
        </div>
      </div>

      <div className="mt-3 space-y-1.5 text-xs">
        <p className="text-zinc-600 dark:text-zinc-400">
          <span className="font-medium text-zinc-900 dark:text-zinc-200">
            Tienes ({recipe.matchedIngredients.length}):
          </span>{' '}
          {recipe.matchedIngredients.join(', ')}
        </p>
        {recipe.missingIngredients.length > 0 && (
          <p className="text-zinc-500 dark:text-zinc-400">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              Te falta ({recipe.missingIngredients.length}):
            </span>{' '}
            {recipe.missingIngredients.join(', ')}
          </p>
        )}
      </div>

      <div className="mt-3 flex justify-end">
        <Link
          href={`/recipe/${recipe.id}`}
          className="text-xs font-medium px-3 py-1.5 rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          Ver preparación
        </Link>
      </div>
    </div>
  );
}
