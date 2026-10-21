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
  bio: string | null;
  coverImageUrl: string | null;
  role: 'USER' | 'CONTRIBUTOR' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

/** Campos editables del formulario de perfil. */
export interface ProfileFormValues {
  name: string;
  bio: string;
  phone: string;
}

export type ProfileImageKind = 'avatar' | 'cover';

// Campos que acepta PATCH /users/me; null quita la foto
export interface ProfileUpdate {
  name?: string;
  bio?: string;
  phone?: string;
  avatarUrl?: string | null;
  coverImageUrl?: string | null;
}
