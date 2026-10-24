'use client';

import React, { useEffect, useState } from 'react';
import { getRecipeComments } from '../api/getRecipeComments';
import type { CommentData } from '../types';
import { CommentSection } from './CommentSection';
import { SkeletonList } from '@/shared/components/ui/Skeleton';

// Comentarios desplegados bajo la tarjeta del feed; se cargan al abrirlos
export function InlineComments({ recipeId }: { recipeId: string }): React.JSX.Element {
  const [comments, setComments] = useState<CommentData[] | null>(null);

  useEffect(() => {
    let active = true;
    void getRecipeComments(recipeId).then((data) => {
      if (active) setComments(data);
    });
    return () => {
      active = false;
    };
  }, [recipeId]);

  if (!comments) {
    return <SkeletonList rows={2} label="Cargando comentarios" />;
  }
  return <CommentSection recipeId={recipeId} initialComments={comments} compact />;
}
