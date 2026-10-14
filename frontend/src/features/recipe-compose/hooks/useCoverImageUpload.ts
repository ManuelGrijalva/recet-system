'use client';

import { useCallback, useState } from 'react';
import { ApiError } from '@/shared/lib/apiClient';
import { uploadRecipeImage } from '../api/uploadRecipeImage';
import { compressImage } from '../lib/compressImage';

interface UseCoverImageUploadResult {
  isUploading: boolean;
  error: string | null;
  upload: (file: File) => Promise<void>;
}

function describeUploadError(err: unknown): string {
  if (err instanceof ApiError && err.status === 401) return 'Inicia sesión para subir fotos.';
  if (err instanceof ApiError && err.status === 403) return 'Solo los colaboradores pueden subir fotos.';
  return err instanceof Error ? err.message : 'No se pudo subir la foto. Intenta de nuevo.';
}

// Comprime y sube la foto en cuanto se elige; al terminar entrega la URL pública
export function useCoverImageUpload(onUploaded: (url: string) => void): UseCoverImageUploadResult {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setError(null);
      try {
        const image = await compressImage(file);
        onUploaded(await uploadRecipeImage(image));
      } catch (err) {
        setError(describeUploadError(err));
      } finally {
        setIsUploading(false);
      }
    },
    [onUploaded],
  );

  return { isUploading, error, upload };
}
