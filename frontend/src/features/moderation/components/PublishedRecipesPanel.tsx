'use client';

import React, { useState } from 'react';
import { Notice } from '@/shared/components/ui/Notice';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { usePublishedRecipes } from '../hooks/usePublishedRecipes';
import { PublishedRecipeRow } from './PublishedRecipeRow';

export function PublishedRecipesPanel(): React.JSX.Element {
  const { recipes, isLoading, error, deletingId, search, remove } = usePublishedRecipes();
  const [term, setTerm] = useState('');

  return (
    <div className="space-y-4">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Recetas visibles en el feed. Elimina las que no cumplan las normas de contenido; la eliminación no se puede deshacer.
      </p>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          search(term);
        }}
      >
        <Input
          aria-label="Buscar recetas publicadas"
          placeholder="Buscar por título"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <Button type="submit" variant="secondary" size="md">
          Buscar
        </Button>
      </form>

      {error && (
        <Notice tone="danger" role="alert">{error}</Notice>
      )}

      {isLoading ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Cargando recetas publicadas...</p>
      ) : recipes.length === 0 ? (
        !error && (
          <div className="rounded-md border border-dashed border-zinc-200 dark:border-zinc-800 p-8 text-center">
            <p className="text-xs text-zinc-500">No se encontraron recetas publicadas.</p>
          </div>
        )
      ) : (
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800 px-4">
          {recipes.map((recipe) => (
            <PublishedRecipeRow
              key={recipe.id}
              recipe={recipe}
              isDeleting={deletingId === recipe.id}
              onDelete={() => void remove(recipe.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
