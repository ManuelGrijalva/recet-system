import React from 'react';
import { cn } from '../../lib/utils';
import { BrandMark } from './BrandMark';

interface RecipeThumbProps {
  coverImageUrl?: string | null;
  coverImageCredit?: string | null;
  className?: string;
}

// Miniatura: solo fotos propias; las de licencia libre exigen el credito visible, que aqui no cabe, y van con el comal
export function RecipeThumb({ coverImageUrl, coverImageCredit, className }: RecipeThumbProps): React.JSX.Element {
  if (coverImageUrl && !coverImageCredit) {
    return (
      <img
        src={coverImageUrl}
        alt=""
        loading="lazy"
        className={cn('shrink-0 rounded-md border border-zinc-200 object-cover dark:border-zinc-800', className)}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900',
        className,
      )}
    >
      <BrandMark size="sm" />
    </span>
  );
}
