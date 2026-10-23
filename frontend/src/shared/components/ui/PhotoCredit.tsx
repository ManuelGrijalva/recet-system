import React from 'react';
import { cn } from '../../lib/utils';

interface PhotoCreditProps {
  credit: string | null | undefined;
  url?: string | null;
  className?: string;
}

// Credito sobre la foto, obligatorio en las fotos con licencia Creative Commons. Va fuera de cualquier enlace.
export function PhotoCredit({ credit, url, className }: PhotoCreditProps): React.JSX.Element | null {
  if (!credit) return null;
  const classes = cn(
    'absolute bottom-1.5 right-1.5 max-w-[85%] truncate rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] text-white',
    className,
  );
  return url ? (
    <a href={url} target="_blank" rel="noopener noreferrer" className={cn(classes, 'hover:bg-black/80')} title={`Foto: ${credit}`}>
      Foto: {credit}
    </a>
  ) : (
    <span className={classes} title={`Foto: ${credit}`}>Foto: {credit}</span>
  );
}
