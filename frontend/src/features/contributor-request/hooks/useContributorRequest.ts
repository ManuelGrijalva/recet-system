'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/shared/lib/apiClient';
import { getMyContributorRequest } from '../api/getMyContributorRequest';
import { submitContributorRequest } from '../api/submitContributorRequest';
import type { ContributorRequest } from '../types';

interface UseContributorRequestResult {
  request: ContributorRequest | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  submit: (motivation: string) => Promise<void>;
}

function describeRequestError(err: unknown): string {
  if (err instanceof ApiError && err.status === 401) return 'Inicia sesión para enviar la solicitud.';
  return err instanceof Error ? err.message : 'No se pudo enviar la solicitud. Intenta de nuevo.';
}

export function useContributorRequest(): UseContributorRequestResult {
  const [request, setRequest] = useState<ContributorRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getMyContributorRequest()
      .then((data) => {
        if (active) setRequest(data);
      })
      .catch(() => {
        if (active) setError('No se pudo consultar tu solicitud.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const submit = useCallback(async (motivation: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const trimmed = motivation.trim();
      setRequest(
        await submitContributorRequest({
          ...(trimmed ? { motivation: trimmed } : {}),
          acceptedGuidelines: true,
        }),
      );
    } catch (err) {
      setError(describeRequestError(err));
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { request, isLoading, isSubmitting, error, submit };
}
