import React from 'react';
import type { RecipeStatus } from '@/shared/types';

interface RecipeReviewNoticeProps {
  status: RecipeStatus;
  reviewNotes?: string | null;
}

const STATUS_MESSAGES: Partial<Record<RecipeStatus, string>> = {
  PENDING_REVIEW: 'Esta receta está pendiente de revisión. Solo tú y el administrador pueden verla.',
  DRAFT: 'Esta receta es un borrador y no es visible para la comunidad.',
  ARCHIVED: 'Esta receta está archivada y no es visible para la comunidad.',
};

export function RecipeReviewNotice({
  status,
  reviewNotes,
}: RecipeReviewNoticeProps): React.JSX.Element | null {
  const message = STATUS_MESSAGES[status];
  if (!message) return null;

  return (
    <div className="p-4 rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 space-y-2">
      <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">{message}</p>
      {reviewNotes && (
        <div>
          <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
            Observaciones del administrador
          </p>
          <p className="text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-line">{reviewNotes}</p>
        </div>
      )}
    </div>
  );
}
