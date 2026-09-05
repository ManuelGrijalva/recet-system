import { API_BASE_URL, apiClient } from '@/shared/lib/apiClient';
import { withFallback } from '@/shared/lib/withFallback';
import type { AuthUser } from '../types';

/** URL de arranque del flujo OAuth de Google en el backend NestJS. */
export function googleLoginUrl(): string {
  return `${API_BASE_URL}/auth/google`;
}

/** `GET /auth/me` — usuario de la sesión actual, o `null` si no hay sesión. */
export function getCurrentUser(): Promise<AuthUser | null> {
  return withFallback(() => apiClient<AuthUser>('auth/me'), null);
}

/** `POST /auth/logout` — limpia la cookie de sesión. */
export function logout(): Promise<{ message: string }> {
  return apiClient<{ message: string }>('auth/logout', { method: 'POST' });
}
