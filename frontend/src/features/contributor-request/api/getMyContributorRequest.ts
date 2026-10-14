import { apiClient } from '@/shared/lib/apiClient';
import type { ContributorRequest } from '../types';

export async function getMyContributorRequest(): Promise<ContributorRequest | null> {
  const { request } = await apiClient<{ request: ContributorRequest | null }>('contributor-requests/mine');
  return request;
}
