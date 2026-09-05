import React from 'react';
import Link from 'next/link';
import type { SavedRecipe } from '../types';

interface SavedRecipeCardProps {
  recipe: SavedRecipe;
}

export function SavedRecipeCard({
  recipe,
}: SavedRecipeCardProps): React.JSX.Element {
  return (
    <div className="p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] flex items-center justify-between">
      <div>
        <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
          {recipe.region} · Por {recipe.author}
        </span>
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {recipe.title}
        </h2>
        <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span>{recipe.timeMinutes} minutos</span>
          <span>•</span>
          <span>{recipe.savedLabel}</span>
        </div>
      </div>

      <Link
        href={`/recipe/${recipe.id}`}
        className="text-xs font-medium px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
      >
        Ver receta
      </Link>
    </div>
  );
}
