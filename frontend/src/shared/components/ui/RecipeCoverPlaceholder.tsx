import React from 'react';
import { cn } from '../../lib/utils';
import { TextilePattern } from './TextilePattern';

interface RecipeCoverPlaceholderProps {
  title: string;
  className?: string;
}

// Portada de reemplazo para recetas sin foto: tejido de fondo y el titulo encima
export function RecipeCoverPlaceholder({ title, className }: RecipeCoverPlaceholderProps): React.JSX.Element {
  return (
    <div
      role="img"
      aria-label={`Receta sin foto: ${title}`}
      className={cn('relative overflow-hidden bg-zinc-50 dark:bg-zinc-900 text-zinc-200 dark:text-zinc-800', className)}
    >
      <TextilePattern className="absolute inset-0" />
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <span className="font-serif text-lg font-semibold text-center text-zinc-700 dark:text-zinc-300 bg-white/90 dark:bg-[#0a0a0a]/90 px-4 py-2 rounded-md line-clamp-2">
          {title}
        </span>
      </div>
    </div>
  );
}
