import { apiClient } from '@/shared/lib/apiClient';
import type { ContributorRequest, ContributorRequestPayload } from '../types';

export function submitContributorRequest(payload: ContributorRequestPayload): Promise<ContributorRequest> {
  return apiClient<ContributorRequest>('contributor-requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
