import React from 'react';
import { Notice } from '@/shared/components/ui/Notice';
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
    <Notice tone={status === 'PENDING_REVIEW' ? 'warning' : reviewNotes ? 'danger' : 'neutral'} className="p-4">
      <p className="font-medium">{message}</p>
      {reviewNotes && (
        <div>
          <p className="font-semibold">Observaciones del administrador</p>
          <p className="whitespace-pre-line">{reviewNotes}</p>
        </div>
      )}
    </Notice>
  );
}
