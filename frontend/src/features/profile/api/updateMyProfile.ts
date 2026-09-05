import { apiClient } from '@/shared/lib/apiClient';
import type { ProfileFormValues, UserProfile } from '../types';

/**
 * `PATCH /users/me` — actualiza los campos editables del perfil.
 * Requiere sesión. Sin fallback: el hook decide el mensaje ante un rechazo.
 */
export function updateMyProfile(
  values: ProfileFormValues,
): Promise<UserProfile> {
  return apiClient<UserProfile>('users/me', {
    method: 'PATCH',
    body: JSON.stringify({
      name: values.name.trim(),
      phone: values.phone.trim() || undefined,
    }),
  });
}
