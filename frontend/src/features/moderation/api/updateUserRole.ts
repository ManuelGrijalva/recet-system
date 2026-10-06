import { apiClient } from '@/shared/lib/apiClient';
import type { ManagedUser } from '../types';

export function updateUserRole(
  userId: string,
  role: 'USER' | 'CONTRIBUTOR',
): Promise<ManagedUser> {
  return apiClient<ManagedUser>(`moderation/users/${userId}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
}
