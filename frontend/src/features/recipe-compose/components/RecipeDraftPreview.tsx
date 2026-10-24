import React from 'react';
import { DIFFICULTY_LABELS } from '@/shared/types';
import { RecipeCoverPlaceholder } from '@/shared/components/ui/RecipeCoverPlaceholder';
import type { RecipeDraft } from '../types';

// Asi se vera la receta en el feed mientras se escribe; sin acciones, solo para revisar
export function RecipeDraftPreview({ draft }: { draft: RecipeDraft }): React.JSX.Element {
  const title = draft.title.trim() || 'Título de tu receta';
  const cover = draft.images[0];
  const total = draft.prepTimeMinutes + draft.cookTimeMinutes;

  return (
    <div aria-label="Vista previa de la tarjeta" className="overflow-hidden rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-[#1c1712]">
      {cover ? (
        <img src={cover} alt="" className="aspect-[4/3] w-full border-b border-zinc-200 object-cover dark:border-zinc-800" />
      ) : (
        <RecipeCoverPlaceholder title={title} className="aspect-[16/7] w-full border-b border-zinc-200 dark:border-zinc-800" />
      )}
      <div className="space-y-2 p-4">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{draft.originRegion || 'Tu municipio'}</p>
        <p className="font-serif text-lg font-semibold leading-snug text-zinc-950 dark:text-zinc-50">{title}</p>
        <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
          {draft.description.trim() || 'Aquí aparecerá la descripción e historia del platillo.'}
        </p>
        <div className="flex flex-wrap gap-2 pt-1 text-xs text-zinc-700 dark:text-zinc-300">
          <span className="rounded-md border border-zinc-200 bg-zinc-100 px-2.5 py-1 dark:border-zinc-800 dark:bg-zinc-900">{total} minutos</span>
          <span className="rounded-md border border-zinc-200 bg-zinc-100 px-2.5 py-1 dark:border-zinc-800 dark:bg-zinc-900">{draft.servings} porciones</span>
          <span className="rounded-md border border-zinc-200 bg-zinc-100 px-2.5 py-1 dark:border-zinc-800 dark:bg-zinc-900">
            Dificultad: {DIFFICULTY_LABELS[draft.difficulty]}
          </span>
        </div>
      </div>
    </div>
  );
}
