'use client';

import React from 'react';
import { Notice } from '@/shared/components/ui/Notice';
import Link from 'next/link';
import { useMyRecipes } from '../hooks/useMyRecipes';
import { MyRecipeRow } from './MyRecipeRow';
import { SkeletonList } from '@/shared/components/ui/Skeleton';
import { EmptyState } from '@/shared/components/ui/EmptyState';

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
        <SkeletonList rows={3} label="Cargando tus recetas" />
      ) : recipes.length === 0 ? (
        <EmptyState title="Todavía no has publicado recetas" description="Comparte la primera receta de tu familia para que no se pierda." action={{ href: '/compose', label: 'Publicar receta' }} />
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
