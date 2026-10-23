import React, { useId } from 'react';
import { cn } from '../../lib/utils';

interface TextilePatternProps {
  className?: string;
}

// Rombos y zigzag inspirados en los tejidos guatemaltecos; monocromatico (usa currentColor)
export function TextilePattern({ className }: TextilePatternProps): React.JSX.Element {
  const id = useId().replace(/:/g, '');

  return (
    <svg className={cn('w-full h-full', className)} aria-hidden="true">
      <defs>
        <pattern id={`tejido-${id}`} width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M24 4 L44 24 L24 44 L4 24 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M24 14 L34 24 L24 34 L14 24 Z" fill="currentColor" fillOpacity="0.35" />
          <path d="M0 0 L6 6 L12 0 M36 0 L42 6 L48 0 M0 48 L6 42 L12 48 M36 48 L42 42 L48 48" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="24" cy="24" r="2" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#tejido-${id})`} />
    </svg>
  );
}
