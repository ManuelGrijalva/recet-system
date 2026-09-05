'use client';

import { useEffect, useState } from 'react';
import { getRecipeComments, type CommentData } from '@/features/comments';

interface UseRecipeCommentsResult {
  comments: CommentData[];
  isLoaded: boolean;
}

/**
 * Carga el hilo inicial de comentarios de una receta. La edición optimista
 * posterior la maneja el slice `comments` (`useComments`) una vez montado.
 */
export function useRecipeComments(recipeId: string): UseRecipeCommentsResult {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    setIsLoaded(false);

    getRecipeComments(recipeId).then((data) => {
      if (!active) return;
      setComments(data);
      setIsLoaded(true);
    });

    return () => {
      active = false;
    };
  }, [recipeId]);

  return { comments, isLoaded };
}
