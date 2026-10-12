import React from 'react';
import type { RecipeDetail } from '../types';

type RecipeSourceNoteProps = Pick<RecipeDetail, 'sourceType' | 'sourceName' | 'sourceUrl'>;

const SOURCE_LABELS: Record<'REFERENCE' | 'INTERVIEW', string> = {
  REFERENCE: 'Receta de referencia documental',
  INTERVIEW: 'Recopilada en trabajo de campo',
};

export function RecipeSourceNote({
  sourceType,
  sourceName,
  sourceUrl,
}: RecipeSourceNoteProps): React.JSX.Element | null {
  // Las recetas publicadas por la comunidad no llevan nota de procedencia
  if (!sourceType || sourceType === 'COMMUNITY' || !sourceName) return null;

  return (
    <aside className="rounded-md border border-zinc-200 dark:border-zinc-800 p-4 space-y-1">
      <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{SOURCE_LABELS[sourceType]}</p>
      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        Fuente:{' '}
        {sourceUrl ? (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            {sourceName}
          </a>
        ) : (
          sourceName
        )}
      </p>
    </aside>
  );
}
