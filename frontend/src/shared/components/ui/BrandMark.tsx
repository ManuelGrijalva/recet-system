import React from 'react';
import { cn } from '@/shared/lib/utils';

interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<BrandMarkProps['size']>, string> = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
};

/**
 * Isotipo monocromático del Recetario Jutiapa. Único punto donde vive la "R".
 */
export function BrandMark({
  size = 'md',
  className,
}: BrandMarkProps): React.JSX.Element {
  return (
    <div
      className={cn(
        'rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold',
        SIZE_CLASSES[size],
        className,
      )}
      aria-hidden="true"
    >
      R
    </div>
  );
}
