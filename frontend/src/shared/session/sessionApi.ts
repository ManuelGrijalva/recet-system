import { apiClient } from '@/shared/lib/apiClient';
import type { SessionUser } from './types';

// Sin sesion (401) o sin backend se trata como invitado
export async function fetchSessionUser(): Promise<SessionUser | null> {
  try {
    return await apiClient<SessionUser>('auth/me');
  } catch {
    return null;
  }
}

export function logoutSession(): Promise<{ message: string }> {
  return apiClient<{ message: string }>('auth/logout', { method: 'POST' });
}
