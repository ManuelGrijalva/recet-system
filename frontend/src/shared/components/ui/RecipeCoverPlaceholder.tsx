import React from 'react';
import { cn } from '../../lib/utils';
import { BrandMark } from './BrandMark';
import { TextilePattern } from './TextilePattern';
import { TextileBand } from './TextileBand';

interface RecipeCoverPlaceholderProps {
  title: string;
  className?: string;
}

// Portada de reemplazo para recetas sin foto: tejido arena, el comal y el titulo, con la franja de color abajo
export function RecipeCoverPlaceholder({ title, className }: RecipeCoverPlaceholderProps): React.JSX.Element {
  return (
    <div
      role="img"
      aria-label={`Receta sin foto: ${title}`}
      className={cn('relative overflow-hidden bg-zinc-100 dark:bg-zinc-900 text-zinc-200 dark:text-zinc-800', className)}
    >
      <TextilePattern className="absolute inset-0" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6">
        <BrandMark size="md" className="drop-shadow-sm" />
        <span className="font-serif text-lg font-semibold text-center text-zinc-800 dark:text-zinc-200 bg-white/95 dark:bg-[#15110d]/90 border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-md line-clamp-2">
          {title}
        </span>
      </div>
      <TextileBand scale={0.5} className="absolute bottom-0 left-0" />
    </div>
  );
}
