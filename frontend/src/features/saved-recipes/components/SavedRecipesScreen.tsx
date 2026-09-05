'use client';

import React from 'react';
import { useSavedRecipes } from '../hooks/useSavedRecipes';
import { SavedRecipeCard } from './SavedRecipeCard';

export function SavedRecipesScreen(): React.JSX.Element {
  const { recipes, isLoading } = useSavedRecipes();

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

      {isLoading ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Cargando tu recetario...</p>
      ) : recipes.length === 0 ? (
        <div className="rounded-md border border-dashed border-zinc-200 dark:border-zinc-800 p-8 text-center">
          <p className="text-xs text-zinc-500">
            Aún no has guardado recetas. Explora el feed y guarda las que quieras cocinar.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recipes.map((recipe) => (
            <SavedRecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
