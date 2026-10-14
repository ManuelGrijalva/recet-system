import { apiClient } from '@/shared/lib/apiClient';
import type { ContributorRequestItem } from '../types';

export function getContributorRequests(): Promise<ContributorRequestItem[]> {
  return apiClient<ContributorRequestItem[]>('moderation/contributor-requests');
}
