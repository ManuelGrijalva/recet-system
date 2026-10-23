import React from 'react';
import { cn } from '@/shared/lib/utils';

interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<BrandMarkProps['size']>, string> = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
};

// Isotipo de Memoria del Comal; unico elemento con color de la interfaz (decision del usuario)
export function BrandMark({
  size = 'md',
  className,
}: BrandMarkProps): React.JSX.Element {
  return (
    <img
      src="/brand/comal.png"
      alt=""
      aria-hidden="true"
      width={256}
      height={256}
      className={cn('shrink-0 object-contain select-none', SIZE_CLASSES[size], className)}
      draggable={false}
    />
  );
}
