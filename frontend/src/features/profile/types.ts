/**
 * Perfil privado del usuario autenticado. Espeja `UserPrivateProfile` del
 * backend (`GET /users/me`) con fechas serializadas.
 */
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  phone: string | null;
  role: 'USER' | 'CONTRIBUTOR' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

/** Campos editables del formulario de perfil. */
export interface ProfileFormValues {
  name: string;
  phone: string;
}
