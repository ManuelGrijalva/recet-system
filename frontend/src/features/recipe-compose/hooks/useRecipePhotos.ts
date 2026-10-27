'use client';

import { useCallback, useState } from 'react';
import { ApiError } from '@/shared/lib/apiClient';
import { useToast } from '@/shared/components/ui/Toast';
import { compressImage, type CropArea } from '@/shared/lib/compressImage';
import { uploadRecipeImage } from '../api/uploadRecipeImage';
import { MAX_RECIPE_PHOTOS } from '../lib/recipePhotos';

interface UseRecipePhotosResult {
  // Foto que espera recorte; las demas elegidas quedan en cola
  pendingFile: File | null;
  queuedCount: number;
  uploadingCount: number;
  error: string | null;
  addFiles: (files: File[]) => void;
  confirmCrop: (area: CropArea) => void;
  skipPending: () => void;
}

function describeUploadError(err: unknown): string {
  if (err instanceof ApiError && err.status === 401) return 'Inicia sesión para subir fotos.';
  if (err instanceof ApiError && err.status === 403) return 'Solo los colaboradores pueden subir fotos.';
  if (err instanceof TypeError) return 'La foto no se pudo subir por un problema de conexión. Intenta de nuevo.';
  return err instanceof Error ? err.message : 'No se pudo subir la foto. Intenta de nuevo.';
}

// Cola de fotos elegidas: cada una se recorta, se comprime y se sube al confirmar
export function useRecipePhotos(
  currentCount: number,
  onUploaded: (url: string) => void,
): UseRecipePhotosResult {
  const [queue, setQueue] = useState<File[]>([]);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const addFiles = useCallback(
    (files: File[]) => {
      const free = MAX_RECIPE_PHOTOS - currentCount - queue.length - uploadingCount;
      setError(files.length > free ? `Una receta admite hasta ${MAX_RECIPE_PHOTOS} fotos.` : null);
      if (free > 0) setQueue((prev) => [...prev, ...files.slice(0, free)]);
    },
    [currentCount, queue.length, uploadingCount],
  );

  const confirmCrop = useCallback(
    (area: CropArea) => {
      const file = queue[0];
      if (!file) return;
      setQueue((prev) => prev.slice(1));
      setUploadingCount((n) => n + 1);
      compressImage(file, undefined, area)
        .then(uploadRecipeImage)
        .then((url) => {
          onUploaded(url);
          toast.show('Foto subida', 'success');
        })
        .catch((err: unknown) => {
          const message = describeUploadError(err);
          setError(message);
          toast.show(message, 'danger');
        })
        .finally(() => setUploadingCount((n) => n - 1));
    },
    [queue, onUploaded, toast],
  );

  const skipPending = useCallback(() => setQueue((prev) => prev.slice(1)), []);

  return {
    pendingFile: queue[0] ?? null,
    queuedCount: queue.length,
    uploadingCount,
    error,
    addFiles,
    confirmCrop,
    skipPending,
  };
}
