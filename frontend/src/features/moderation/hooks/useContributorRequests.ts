'use client';

import { useCallback, useEffect, useState } from 'react';
import { getContributorRequests } from '../api/getContributorRequests';
import { reviewContributorRequest } from '../api/reviewContributorRequest';
import { describeModerationError } from '../lib/describeModerationError';
import type { ContributorRequestDecision, ContributorRequestItem } from '../types';

interface UseContributorRequestsResult {
  requests: ContributorRequestItem[];
  isLoading: boolean;
  error: string | null;
  reviewingId: string | null;
  review: (requestId: string, decision: ContributorRequestDecision) => Promise<boolean>;
}

export function useContributorRequests(): UseContributorRequestsResult {
  const [requests, setRequests] = useState<ContributorRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getContributorRequests()
      .then((data) => {
        if (active) setRequests(data);
      })
      .catch((err: unknown) => {
        if (active) setError(describeModerationError(err));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const review = useCallback(
    async (requestId: string, decision: ContributorRequestDecision): Promise<boolean> => {
      setReviewingId(requestId);
      setError(null);
      try {
        await reviewContributorRequest(requestId, decision);
        setRequests((prev) => prev.filter((r) => r.id !== requestId));
        return true;
      } catch (err) {
        setError(describeModerationError(err));
        return false;
      } finally {
        setReviewingId(null);
      }
    },
    [],
  );

  return { requests, isLoading, error, reviewingId, review };
}
