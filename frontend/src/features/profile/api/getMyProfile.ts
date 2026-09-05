import { apiClient } from '@/shared/lib/apiClient';
import { withFallback } from '@/shared/lib/withFallback';
import type { UserProfile } from '../types';
import { profileMock } from './profile.mock';

/**
 * `GET /users/me` — perfil privado del usuario autenticado.
 * Cae al seed si no hay sesión o backend.
 */
export function getMyProfile(): Promise<UserProfile> {
  return withFallback(() => apiClient<UserProfile>('users/me'), profileMock);
}
