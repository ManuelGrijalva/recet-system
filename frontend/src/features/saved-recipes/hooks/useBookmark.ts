'use client';

import { useCallback, useState } from 'react';
import { useToast } from '@/shared/components/ui/Toast';
import { toggleBookmark } from '../api/toggleBookmark';

interface UseBookmarkResult {
  isBookmarked: boolean;
  isSaving: boolean;
  toggle: () => Promise<void>;
}

export function useBookmark(recipeId: string, initialBookmarked: boolean): UseBookmarkResult {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  const toggle = useCallback(async () => {
    setIsSaving(true);
    const previous = isBookmarked;
    setIsBookmarked(!previous);
    try {
      const result = await toggleBookmark(recipeId);
      setIsBookmarked(result.isBookmarked);
      toast.show(result.isBookmarked ? 'Receta guardada en tu recetario' : 'Receta quitada de tu recetario', result.isBookmarked ? 'success' : 'neutral');
    } catch {
      setIsBookmarked(previous);
      toast.show('No se pudo guardar. Intenta de nuevo.', 'danger');
    } finally {
      setIsSaving(false);
    }
  }, [recipeId, isBookmarked, toast]);

  return { isBookmarked, isSaving, toggle };
}
