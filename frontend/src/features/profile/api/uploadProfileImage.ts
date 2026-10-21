import { apiClient } from '@/shared/lib/apiClient';
import { compressImage } from '@/shared/lib/compressImage';
import type { ProfileImageKind } from '../types';

interface UploadTicket {
  uploadUrl: string;
  publicUrl: string;
}

// La foto de perfil se reduce mas que la portada
const MAX_SIDE: Record<ProfileImageKind, number> = { avatar: 512, cover: 1600 };

// Comprime, pide la URL prefirmada y sube directo a R2; devuelve la URL publica
export async function uploadProfileImage(kind: ProfileImageKind, file: File): Promise<string> {
  const image = await compressImage(file, MAX_SIDE[kind]);
  const ticket = await apiClient<UploadTicket>('media/profile-images', {
    method: 'POST',
    body: JSON.stringify({ kind, contentType: image.contentType, size: image.blob.size }),
  });
  const response = await fetch(ticket.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': image.contentType },
    body: image.blob,
  });
  if (!response.ok) throw new Error('No se pudo subir la foto. Intenta de nuevo.');
  return ticket.publicUrl;
}
