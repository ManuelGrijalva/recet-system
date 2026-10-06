'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardContent, CardFooter } from '@/shared/components/ui/Card';
import { DIFFICULTY_LABELS } from '@/shared/types';
import type { PendingRecipe, ReviewDecision } from '../types';

interface PendingRecipeCardProps {
  recipe: PendingRecipe;
  isReviewing: boolean;
  onReview: (decision: ReviewDecision) => Promise<boolean>;
}

const dateFormatter = new Intl.DateTimeFormat('es-GT', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export function PendingRecipeCard({
  recipe,
  isReviewing,
  onReview,
}: PendingRecipeCardProps): React.JSX.Element {
  const [isReturning, setIsReturning] = useState(false);
  const [notes, setNotes] = useState('');
  const totalMinutes = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/recipe/${recipe.id}`}
            className="text-sm font-semibold text-zinc-950 dark:text-zinc-50 hover:underline"
          >
            {recipe.title}
          </Link>
          <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
            {dateFormatter.format(new Date(recipe.createdAt))}
          </span>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Por {recipe.author.name} · {recipe.originRegion} · {totalMinutes} min ·{' '}
          {DIFFICULTY_LABELS[recipe.difficulty]}
        </p>
        <p className="text-xs text-zinc-700 dark:text-zinc-300 line-clamp-3">
          {recipe.description}
        </p>
      </CardContent>

      <CardFooter>
        {isReturning ? (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              void onReview({ decision: 'RETURN', notes: notes.trim() }).then((ok) => {
                if (ok) setIsReturning(false);
              });
            }}
          >
            <label
              htmlFor={`notes-${recipe.id}`}
              className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
            >
              Observaciones para el autor
            </label>
            <textarea
              id={`notes-${recipe.id}`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={2000}
              required
              className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsReturning(false)}
                disabled={isReviewing}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isReviewing}
                disabled={notes.trim().length === 0}
              >
                Devolver al autor
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsReturning(true)}
              disabled={isReviewing}
            >
              Devolver con observaciones
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isReviewing}
              onClick={() => void onReview({ decision: 'APPROVE' })}
            >
              Aprobar y publicar
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
