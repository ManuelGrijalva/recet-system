'use client';

import React, { useEffect, useState } from 'react';
import { getRecipeComments } from '../api/getRecipeComments';
import type { CommentData } from '../types';
import { CommentSection } from './CommentSection';

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
    return <p className="text-xs text-zinc-500 dark:text-zinc-400">Cargando comentarios...</p>;
  }
  return <CommentSection recipeId={recipeId} initialComments={comments} compact />;
}
