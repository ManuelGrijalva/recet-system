'use client';

import React from 'react';
import { useSession } from '@/shared/session';
import { useSavedRecipes } from '../hooks/useSavedRecipes';
import { CookbookPdfButton } from '@/features/recipe-export';
import { RecipeTile, RecipeTileGrid } from '@/shared/components/ui/RecipeTile';
import { TextileBand } from '@/shared/components/ui/TextileBand';
import { SkeletonList } from '@/shared/components/ui/Skeleton';
import { EmptyState } from '@/shared/components/ui/EmptyState';

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
        <TextileBand scale={0.375} className="mt-3 rounded-sm" />
      </div>

      {error && (
        <p className="text-xs text-zinc-700 dark:text-zinc-300">{error}</p>
      )}

      {isLoading ? (
        <SkeletonList rows={3} label="Cargando tu recetario" />
      ) : recipes.length === 0 && !error ? (
        <EmptyState
          title="Tu recetario está vacío"
          description="Guarda las recetas que quieras cocinar con el ícono de guardar del feed o con el botón Guardar de cada receta."
          action={{ href: '/', label: 'Explorar recetas', primary: true }}
        />
      ) : (
        <div className="space-y-3">
          {recipes.length > 0 && (
            <div className="flex justify-end">
              <CookbookPdfButton />
            </div>
          )}
          <RecipeTileGrid>
            {recipes.map((recipe, index) => (
              <RecipeTile
                key={recipe.id}
                id={recipe.id}
                title={recipe.title}
                coverImageUrl={recipe.coverImageUrl}
                coverImageCredit={recipe.coverImageCredit}
                coverImageCreditUrl={recipe.coverImageCreditUrl}
                meta={`${recipe.timeMinutes} min · ${recipe.author}`}
                index={index}
              />
            ))}
          </RecipeTileGrid>
        </div>
      )}
    </div>
  );
}

export function SavedRecipesScreen(): React.JSX.Element {
  const { status } = useSession();

  if (status === 'loading') {
    return <SkeletonList rows={3} label="Cargando tu recetario" />;
  }

  if (status === 'guest') {
    return (
      <EmptyState
        title="Guarda tus recetas favoritas"
        description="Inicia sesión para guardar recetas y consultarlas en tu recetario personal."
        action={{ href: '/login', label: 'Iniciar sesión', primary: true }}
      />
    );
  }

  return <SavedRecipesContent />;
}
