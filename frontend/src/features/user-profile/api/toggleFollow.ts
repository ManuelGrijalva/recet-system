import { apiClient } from '@/shared/lib/apiClient';
import type { FollowState } from '../types';

export function toggleFollow(userId: string): Promise<FollowState> {
  return apiClient<FollowState>(`users/${userId}/follow`, { method: 'POST' });
}
