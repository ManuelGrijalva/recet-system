'use client';

import React from 'react';
import { Notice } from '@/shared/components/ui/Notice';
import { useContributorRequests } from '../hooks/useContributorRequests';
import { ContributorRequestCard } from './ContributorRequestCard';

export function ContributorRequestsPanel(): React.JSX.Element {
  const { requests, isLoading, error, reviewingId, review } = useContributorRequests();

  return (
    <div className="space-y-4">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Usuarios que aceptaron las normas de contenido y piden publicar recetas. Aprobar les otorga el rol de colaborador.
      </p>

      {error && (
        <Notice tone="danger" role="alert">{error}</Notice>
      )}

      {isLoading ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Cargando solicitudes...</p>
      ) : requests.length === 0 ? (
        !error && (
          <div className="rounded-md border border-dashed border-zinc-200 dark:border-zinc-800 p-8 text-center">
            <p className="text-xs text-zinc-500">No hay solicitudes pendientes.</p>
          </div>
        )
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
            <ContributorRequestCard
              key={request.id}
              request={request}
              isReviewing={reviewingId === request.id}
              onReview={(decision) => review(request.id, decision)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
