'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/Button';
import type { PendingRecipe } from '../types';

interface PublishedRecipeRowProps {
  recipe: PendingRecipe;
  isDeleting: boolean;
  onDelete: () => void;
}

export function PublishedRecipeRow({ recipe, isDeleting, onDelete }: PublishedRecipeRowProps): React.JSX.Element {
  const [confirming, setConfirming] = useState(false);

  return (
    <li className="flex items-center gap-3 py-3">
      {recipe.coverImageUrl ? (
        <img
          src={recipe.coverImageUrl}
          alt=""
          loading="lazy"
          className="w-14 h-14 shrink-0 rounded-md object-cover border border-zinc-200 dark:border-zinc-800"
        />
      ) : (
        <div className="w-14 h-14 shrink-0 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800" />
      )}

      <div className="flex-1 min-w-0">
        <Link
          href={`/recipe/${recipe.id}`}
          className="text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:underline line-clamp-1"
        >
          {recipe.title}
        </Link>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
          Por {recipe.author.name} · {recipe.originRegion}
        </p>
      </div>

      <div className="flex shrink-0 gap-2">
        {confirming ? (
          <>
            <Button size="sm" variant="ghost" onClick={() => setConfirming(false)} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button size="sm" variant="danger" onClick={onDelete} isLoading={isDeleting}>
              Eliminar
            </Button>
          </>
        ) : (
          <Button size="sm" variant="dangerOutline" onClick={() => setConfirming(true)}>
            Eliminar
          </Button>
        )}
      </div>
    </li>
  );
}
