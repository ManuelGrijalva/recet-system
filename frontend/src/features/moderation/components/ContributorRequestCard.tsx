'use client';

import React, { useState } from 'react';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardContent, CardFooter } from '@/shared/components/ui/Card';
import type { ContributorRequestDecision, ContributorRequestItem } from '../types';

interface ContributorRequestCardProps {
  request: ContributorRequestItem;
  isReviewing: boolean;
  onReview: (decision: ContributorRequestDecision) => Promise<boolean>;
}

const dateFormatter = new Intl.DateTimeFormat('es-GT', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export function ContributorRequestCard({
  request,
  isReviewing,
  onReview,
}: ContributorRequestCardProps): React.JSX.Element {
  const [isRejecting, setIsRejecting] = useState(false);
  const [notes, setNotes] = useState('');

  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <Avatar src={request.user.avatarUrl} alt={request.user.name} fallbackName={request.user.name} size="md" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{request.user.name}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{request.user.email}</p>
          </div>
          <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
            {dateFormatter.format(new Date(request.createdAt))}
          </span>
        </div>
        <p className="text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
          {request.motivation ?? 'No escribió qué recetas quiere compartir.'}
        </p>
      </CardContent>

      <CardFooter>
        {isRejecting ? (
          <form
            className="w-full space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              const trimmed = notes.trim();
              void onReview({ decision: 'REJECT', ...(trimmed ? { notes: trimmed } : {}) });
            }}
          >
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
              rows={2}
              placeholder="Motivo del rechazo (opcional, lo verá el usuario)"
              className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] p-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            />
            <div className="flex justify-end gap-2">
              <Button type="button" size="sm" variant="ghost" onClick={() => setIsRejecting(false)} disabled={isReviewing}>
                Cancelar
              </Button>
              <Button type="submit" size="sm" variant="danger" isLoading={isReviewing}>
                Rechazar solicitud
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex w-full justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => setIsRejecting(true)} disabled={isReviewing}>
              Rechazar
            </Button>
            <Button size="sm" variant="success" isLoading={isReviewing} onClick={() => void onReview({ decision: 'APPROVE' })}>
              Aprobar
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
