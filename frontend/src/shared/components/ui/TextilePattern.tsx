import React, { useId } from 'react';
import { cn } from '../../lib/utils';

interface TextilePatternProps {
  className?: string;
  // mono usa currentColor (escala zinc); color usa la paleta de los cortes y huipiles
  variant?: 'mono' | 'color';
}

// Colores de tejidos guatemaltecos: unica pieza de color junto al isotipo (decision del usuario)
const TEXTILE_COLORS = {
  base: '#b3202a',
  stripe: '#5b2a86',
  diamond: '#f2b705',
  core: '#1f6fb2',
  zigzag: '#2e8b57',
  dot: '#ffffff',
};

// Rombos y zigzag inspirados en los tejidos guatemaltecos
export function TextilePattern({ className, variant = 'mono' }: TextilePatternProps): React.JSX.Element {
  const id = `tejido-${useId().replace(/:/g, '')}`;

  return (
    <svg className={cn('w-full h-full', className)} aria-hidden="true">
      <defs>
        {variant === 'mono' ? (
          <pattern id={id} width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M24 4 L44 24 L24 44 L4 24 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M24 14 L34 24 L24 34 L14 24 Z" fill="currentColor" fillOpacity="0.35" />
            <path d="M0 0 L6 6 L12 0 M36 0 L42 6 L48 0 M0 48 L6 42 L12 48 M36 48 L42 42 L48 48" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="24" cy="24" r="2" fill="currentColor" />
          </pattern>
        ) : (
          <pattern id={id} width="48" height="48" patternUnits="userSpaceOnUse">
            <rect width="48" height="48" fill={TEXTILE_COLORS.base} />
            <rect y="22" width="48" height="4" fill={TEXTILE_COLORS.stripe} />
            <path d="M24 4 L44 24 L24 44 L4 24 Z" fill="none" stroke={TEXTILE_COLORS.diamond} strokeWidth="3" />
            <path d="M24 14 L34 24 L24 34 L14 24 Z" fill={TEXTILE_COLORS.core} />
            <path d="M0 0 L6 6 L12 0 M36 0 L42 6 L48 0 M0 48 L6 42 L12 48 M36 48 L42 42 L48 48" fill="none" stroke={TEXTILE_COLORS.zigzag} strokeWidth="2.5" />
            <circle cx="24" cy="24" r="2.5" fill={TEXTILE_COLORS.dot} />
          </pattern>
        )}
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
