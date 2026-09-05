/**
 * Usuario autenticado tal como lo devuelve `GET /auth/me` del backend.
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: 'USER' | 'CONTRIBUTOR' | 'ADMIN';
}
