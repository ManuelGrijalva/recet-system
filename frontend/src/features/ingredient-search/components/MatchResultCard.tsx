import React from 'react';
import Link from 'next/link';
import { CheckCircleIcon } from '@/shared/components/ui/icons';
import { RecipeThumb } from '@/shared/components/ui/RecipeThumb';
import type { MatchedRecipe } from '../types';

interface MatchResultCardProps {
  recipe: MatchedRecipe;
}

// Resultado de la busqueda: cuanto tienes de la receta, con barra, y que ingredientes tienes y cuales te faltan
export function MatchResultCard({
  recipe,
}: MatchResultCardProps): React.JSX.Element {
  const percentage = Math.max(0, Math.min(100, Math.round(recipe.matchPercentage)));

  return (
    <article className="rounded-md border border-zinc-200 bg-white p-4 transition-[border-color,box-shadow] duration-200 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-[#1c1712]">
      <div className="flex gap-3">
        <RecipeThumb coverImageUrl={recipe.coverImageUrl} coverImageCredit={recipe.coverImageCredit} className="h-16 w-16 sm:h-20 sm:w-20" />
        <div className="min-w-0 flex-1">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">{recipe.region}</span>
          <h3 className="font-serif text-base font-semibold leading-snug text-zinc-900 dark:text-zinc-100">{recipe.title}</h3>
          <div className="mt-2 flex items-center gap-2">
            <div
              role="progressbar"
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Ingredientes que ya tienes"
              className="h-2 flex-1 overflow-hidden rounded-sm bg-zinc-100 dark:bg-zinc-900"
            >
              <div className="h-full rounded-sm bg-brand transition-[width] duration-300 ease-out-strong" style={{ width: `${percentage}%` }} />
            </div>
            <span className="shrink-0 text-xs font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">{percentage}% disponible</span>
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-2 text-xs">
        <div>
          <p className="mb-1 font-medium text-zinc-700 dark:text-zinc-300">Tienes ({recipe.matchedIngredients.length})</p>
          <ul className="flex flex-wrap gap-1.5">
            {recipe.matchedIngredients.map((name) => (
              <li key={name} className="inline-flex items-center gap-1 rounded-md border border-success bg-success-soft px-2 py-0.5 text-success-soft-foreground">
                <CheckCircleIcon className="h-3 w-3" />
                {name}
              </li>
            ))}
          </ul>
        </div>
        {recipe.missingIngredients.length > 0 && (
          <div>
            <p className="mb-1 font-medium text-zinc-700 dark:text-zinc-300">Te falta ({recipe.missingIngredients.length})</p>
            <ul className="flex flex-wrap gap-1.5">
              {recipe.missingIngredients.map((name) => (
                <li key={name} className="rounded-md border border-dashed border-zinc-300 px-2 py-0.5 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-3 flex justify-end">
        <Link
          href={`/recipe/${recipe.id}`}
          className="inline-flex min-h-9 items-center rounded-md bg-zinc-900 px-3 text-xs font-medium text-white transition-[background-color,transform] duration-150 ease-out-strong hover:bg-zinc-800 active:scale-[0.97] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Ver preparación
        </Link>
      </div>
    </article>
  );
}
