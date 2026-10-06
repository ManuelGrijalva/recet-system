import { apiClient } from '@/shared/lib/apiClient';
import type { ManagedUser } from '../types';

export function getManagedUsers(query?: string): Promise<ManagedUser[]> {
  return apiClient<ManagedUser[]>('moderation/users', {
    params: { q: query?.trim() || undefined },
  });
}
