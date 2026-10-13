'use client';

import { useCallback, useState } from 'react';
import { toggleBookmark } from '../api/toggleBookmark';

interface UseBookmarkResult {
  isBookmarked: boolean;
  isSaving: boolean;
  toggle: () => Promise<void>;
}

export function useBookmark(recipeId: string, initialBookmarked: boolean): UseBookmarkResult {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isSaving, setIsSaving] = useState(false);

  const toggle = useCallback(async () => {
    setIsSaving(true);
    const previous = isBookmarked;
    setIsBookmarked(!previous);
    try {
      const result = await toggleBookmark(recipeId);
      setIsBookmarked(result.isBookmarked);
    } catch {
      setIsBookmarked(previous);
    } finally {
      setIsSaving(false);
    }
  }, [recipeId, isBookmarked]);

  return { isBookmarked, isSaving, toggle };
}
