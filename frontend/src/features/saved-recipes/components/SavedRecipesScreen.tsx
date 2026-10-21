'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from '@/shared/session';
import { useSavedRecipes } from '../hooks/useSavedRecipes';
import { CookbookPdfButton } from '@/features/recipe-export';
import { SavedRecipeCard } from './SavedRecipeCard';

function SavedRecipesContent(): React.JSX.Element {
  const { recipes, isLoading, error } = useSavedRecipes();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          Recetario guardado
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Tu colección privada de preparaciones tradicionales guardadas para cocinar cuando quieras.
        </p>
      </div>

      {error && (
        <p className="text-xs text-zinc-700 dark:text-zinc-300">{error}</p>
      )}

      {isLoading ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Cargando tu recetario...</p>
      ) : recipes.length === 0 && !error ? (
        <div className="rounded-md border border-dashed border-zinc-200 dark:border-zinc-800 p-8 text-center">
          <p className="text-xs text-zinc-500">
            Aún no has guardado recetas. Abre una receta y presiona "Guardar en mi recetario".
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recipes.length > 0 && (
            <div className="flex justify-end">
              <CookbookPdfButton />
            </div>
          )}
          {recipes.map((recipe) => (
            <SavedRecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}

export function SavedRecipesScreen(): React.JSX.Element {
  const { status } = useSession();

  if (status === 'loading') {
    return <p className="text-xs text-zinc-500 dark:text-zinc-400">Cargando tu recetario...</p>;
  }

  if (status === 'guest') {
    return (
      <div className="rounded-md border border-dashed border-zinc-200 dark:border-zinc-800 p-8 text-center space-y-3">
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          Inicia sesión para guardar recetas y consultarlas en tu recetario personal.
        </p>
        <Link
          href="/login"
          className="inline-flex h-9 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return <SavedRecipesContent />;
}
