import { API_BASE_URL } from '@/shared/lib/apiClient';

/** URL de arranque del flujo OAuth de Google en el backend NestJS. */
export function googleLoginUrl(): string {
  return `${API_BASE_URL}/auth/google`;
}

// La lectura de la sesion y el cierre viven en @/shared/session
export { fetchSessionUser as getCurrentUser, logoutSession as logout } from '@/shared/session';
