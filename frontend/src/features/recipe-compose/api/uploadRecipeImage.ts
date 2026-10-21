import { apiClient } from '@/shared/lib/apiClient';
import type { CompressedImage } from '@/shared/lib/compressImage';
import type { ImageUploadTicket } from '../types';

// Pide una URL prefirmada al backend y sube la foto directo a R2; devuelve la URL pública
export async function uploadRecipeImage(image: CompressedImage): Promise<string> {
  const ticket = await apiClient<ImageUploadTicket>('media/recipe-images', {
    method: 'POST',
    body: JSON.stringify({ contentType: image.contentType, size: image.blob.size }),
  });

  const response = await fetch(ticket.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': image.contentType },
    body: image.blob,
  });
  if (!response.ok) {
    throw new Error('No se pudo subir la foto. Intenta de nuevo.');
  }

  return ticket.publicUrl;
}
