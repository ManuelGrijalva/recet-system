import { apiClient } from '@/shared/lib/apiClient';
import type { PublicProfile } from '../types';

export function getPublicProfile(userId: string): Promise<PublicProfile> {
  return apiClient<PublicProfile>(`users/${userId}`);
}
