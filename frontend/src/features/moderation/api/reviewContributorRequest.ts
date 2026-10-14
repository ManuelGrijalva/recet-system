import { apiClient } from '@/shared/lib/apiClient';
import type { ContributorRequestDecision } from '../types';

export async function reviewContributorRequest(
  requestId: string,
  review: ContributorRequestDecision,
): Promise<void> {
  await apiClient<Record<string, never>>(`moderation/contributor-requests/${requestId}`, {
    method: 'PATCH',
    body: JSON.stringify(review),
  });
}
