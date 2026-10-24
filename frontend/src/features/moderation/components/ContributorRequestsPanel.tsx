'use client';

import React from 'react';
import { Notice } from '@/shared/components/ui/Notice';
import { useContributorRequests } from '../hooks/useContributorRequests';
import { ContributorRequestCard } from './ContributorRequestCard';
import { SkeletonList } from '@/shared/components/ui/Skeleton';
import { EmptyState } from '@/shared/components/ui/EmptyState';

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
        <SkeletonList rows={3} label="Cargando solicitudes" />
      ) : requests.length === 0 ? (
        !error && (
          <EmptyState title="Todo al día" description="No hay solicitudes pendientes." />
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
