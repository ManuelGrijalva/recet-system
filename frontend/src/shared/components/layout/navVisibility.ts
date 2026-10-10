import type { UserRole } from '../../session';

// 'all': todos; 'guest': solo sin sesion; 'auth': cualquier sesion; lista: solo esos roles
export type NavVisibility = 'all' | 'guest' | 'auth' | UserRole[];

export function isNavVisible(visibleTo: NavVisibility, role: UserRole | null): boolean {
  if (visibleTo === 'all') return true;
  if (visibleTo === 'guest') return role === null;
  if (visibleTo === 'auth') return role !== null;
  return role !== null && visibleTo.includes(role);
}
