'use client';

import React from 'react';
import { Notice } from '@/shared/components/ui/Notice';
import Link from 'next/link';
import { useMyRecipes } from '../hooks/useMyRecipes';
import { MyRecipeRow } from './MyRecipeRow';

export function MyRecipesSection(): React.JSX.Element {
  const { recipes, isLoading, error, deletingId, remove } = useMyRecipes();

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Mis recetas</h2>
        <Link
          href="/compose"
          className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          Nueva receta
        </Link>
      </div>

      {error && <Notice tone="danger" role="alert">{error}</Notice>}

      {isLoading ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Cargando tus recetas...</p>
      ) : recipes.length === 0 ? (
        <div className="rounded-md border border-dashed border-zinc-200 dark:border-zinc-800 p-6 text-center">
          <p className="text-xs text-zinc-500">Todavía no has publicado recetas.</p>
        </div>
      ) : (
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800 px-4">
          {recipes.map((recipe) => (
            <MyRecipeRow
              key={recipe.id}
              recipe={recipe}
              isDeleting={deletingId === recipe.id}
              onDelete={() => void remove(recipe.id)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
