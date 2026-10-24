'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/Button';
import { StatusBadge, type StatusTone } from '@/shared/components/ui/StatusBadge';
import { describeRecipeStatus } from '../lib/describeRecipeStatus';
import type { MyRecipe } from '../types';

interface MyRecipeRowProps {
  recipe: MyRecipe;
  isDeleting: boolean;
  onDelete: () => void;
}

function statusTone(recipe: MyRecipe): StatusTone {
  if (recipe.status === 'PUBLISHED') return 'success';
  if (recipe.status === 'PENDING_REVIEW') return 'warning';
  if (recipe.status === 'DRAFT' && recipe.reviewNotes) return 'danger';
  return 'neutral';
}

export function MyRecipeRow({ recipe, isDeleting, onDelete }: MyRecipeRowProps): React.JSX.Element {
  const [confirming, setConfirming] = useState(false);

  return (
    <li className="py-3 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={`/recipe/${recipe.id}`}
            className="text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:underline"
          >
            {recipe.title}
          </Link>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <StatusBadge tone={statusTone(recipe)}>{describeRecipeStatus(recipe)}</StatusBadge>
            {recipe.originRegion}
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <Link
            href={`/recipe/${recipe.id}/edit`}
            className="inline-flex h-8 items-center rounded-md border border-zinc-200 dark:border-zinc-800 px-3 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Editar
          </Link>
          {confirming ? (
            <>
              <Button size="sm" variant="ghost" onClick={() => setConfirming(false)} disabled={isDeleting}>
                Cancelar
              </Button>
              <Button size="sm" variant="danger" onClick={onDelete} isLoading={isDeleting}>
                Confirmar
              </Button>
            </>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => setConfirming(true)}>
              Eliminar
            </Button>
          )}
        </div>
      </div>

      {recipe.status === 'DRAFT' && recipe.reviewNotes && (
        <p className="text-xs text-zinc-700 dark:text-zinc-300 rounded-md border border-zinc-200 dark:border-zinc-800 p-2.5 whitespace-pre-line">
          <span className="font-medium">Observaciones: </span>
          {recipe.reviewNotes}
        </p>
      )}
    </li>
  );
}
