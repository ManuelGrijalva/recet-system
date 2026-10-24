'use client';

import React, { useEffect, useState } from 'react';
import { ShareIcon } from '@/shared/components/ui/icons';
import { shareRecipe, type ShareOutcome } from '../lib/shareRecipe';

interface ShareRecipeButtonProps {
  recipeId: string;
  title: string;
  // icon: solo el icono (tarjeta del feed); button: con texto (detalle)
  variant?: 'icon' | 'button';
}

const FEEDBACK: Partial<Record<ShareOutcome, string>> = {
  copied: 'Enlace copiado',
  failed: 'No se pudo compartir',
};

export function ShareRecipeButton({ recipeId, title, variant = 'icon' }: ShareRecipeButtonProps): React.JSX.Element {
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(null), 2500);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const handleClick = async (): Promise<void> => {
    setFeedback(FEEDBACK[await shareRecipe(recipeId, title)] ?? null);
  };

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={() => void handleClick()}
        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 px-3 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <ShareIcon className="w-4 h-4" />
        {feedback ?? 'Compartir'}
      </button>
    );
  }

  return (
    <span className="flex items-center gap-1">
      {feedback && (
        <span role="status" className="text-[11px] text-zinc-500 dark:text-zinc-400">
          {feedback}
        </span>
      )}
      <button
        type="button"
        onClick={() => void handleClick()}
        className="inline-flex h-10 w-10 sm:h-8 sm:w-8 items-center justify-center rounded-md text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-[color,background-color,transform] duration-150 ease-out-strong active:scale-95 motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        aria-label="Compartir receta"
        title="Compartir receta"
      >
        <ShareIcon />
      </button>
    </span>
  );
}
