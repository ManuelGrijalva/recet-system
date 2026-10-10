export type UserRole = 'USER' | 'CONTRIBUTOR' | 'ADMIN';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: UserRole;
}

export type SessionStatus = 'loading' | 'authenticated' | 'guest';

export const ROLE_LABELS: Record<UserRole, string> = {
  USER: 'Usuario general',
  CONTRIBUTOR: 'Colaborador',
  ADMIN: 'Administrador',
};
