'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/Button';
import { useSession } from '@/shared/session';
import { useBookmark } from '../hooks/useBookmark';

interface BookmarkButtonProps {
  recipeId: string;
  initialBookmarked: boolean;
}

export function BookmarkButton({
  recipeId,
  initialBookmarked,
}: BookmarkButtonProps): React.JSX.Element | null {
  const { status } = useSession();
  const { isBookmarked, isSaving, toggle } = useBookmark(recipeId, initialBookmarked);

  if (status === 'loading') return null;

  if (status === 'guest') {
    return (
      <Link
        href="/login"
        className="inline-flex h-8 items-center rounded-md border border-zinc-200 dark:border-zinc-800 px-3 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
      >
        <span className="sm:hidden">Guardar</span>
        <span className="hidden sm:inline">Inicia sesión para guardar</span>
      </Link>
    );
  }

  return (
    <Button
      variant={isBookmarked ? 'secondary' : 'outline'}
      size="sm"
      onClick={() => void toggle()}
      disabled={isSaving}
      aria-pressed={isBookmarked}
    >
      {/* En el celular la etiqueta corta para que quepa en la barra fija */}
      <span className="sm:hidden">{isBookmarked ? 'Guardada' : 'Guardar'}</span>
      <span className="hidden sm:inline">{isBookmarked ? 'Guardada en mi recetario' : 'Guardar en mi recetario'}</span>
    </Button>
  );
}
