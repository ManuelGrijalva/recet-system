'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { BookmarkIcon, BookmarkSolidIcon } from '@/shared/components/ui/icons';
import { useSession } from '@/shared/session';
import { useBookmark } from '../hooks/useBookmark';

interface BookmarkIconButtonProps {
  recipeId: string;
  initialBookmarked: boolean;
}

// Guardar desde la tarjeta del feed; el invitado va a iniciar sesion, como al reaccionar
export function BookmarkIconButton({ recipeId, initialBookmarked }: BookmarkIconButtonProps): React.JSX.Element {
  const router = useRouter();
  const { status } = useSession();
  const { isBookmarked, isSaving, toggle } = useBookmark(recipeId, initialBookmarked);
  // El rebote solo al guardar con un toque, no cuando el estado llega del servidor
  const [justSaved, setJustSaved] = useState(false);
  const label = isBookmarked ? 'Quitar de mi recetario' : 'Guardar en mi recetario';

  return (
    <button
      type="button"
      onClick={() => {
        if (status === 'guest') {
          router.push('/login');
          return;
        }
        setJustSaved(!isBookmarked);
        void toggle();
      }}
      disabled={isSaving || status === 'loading'}
      aria-pressed={isBookmarked}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-md transition-[color,background-color,transform] duration-150 ease-out-strong active:scale-95 motion-reduce:active:scale-100 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:h-8 sm:w-8',
        isBookmarked
          ? 'text-brand hover:bg-brand-soft'
          : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50',
      )}
    >
      {isBookmarked ? <BookmarkSolidIcon className={cn('h-4 w-4', justSaved && 'animate-reaction-pop')} /> : <BookmarkIcon className="h-4 w-4" />}
    </button>
  );
}
