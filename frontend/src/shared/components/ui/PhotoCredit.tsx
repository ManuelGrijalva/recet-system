import React from 'react';
import { cn } from '../../lib/utils';

interface PhotoCreditProps {
  credit: string | null | undefined;
  url?: string | null;
  className?: string;
}

// Credito sobre la foto, obligatorio en las fotos con licencia Creative Commons. Va fuera de cualquier enlace.
// Cortado en una linea; al pasar el cursor o enfocarlo se despliega completo
export function PhotoCredit({ credit, url, className }: PhotoCreditProps): React.JSX.Element | null {
  if (!credit) return null;
  const classes = cn(
    'absolute bottom-1.5 right-1.5 z-10 max-w-[85%] truncate rounded-md bg-black/60 px-1.5 py-0.5 text-[11px] leading-snug text-white',
    'hover:whitespace-normal hover:bg-black/80 focus:whitespace-normal focus:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
    className,
  );
  return url ? (
    <a href={url} target="_blank" rel="noopener noreferrer" className={classes} title={`Foto: ${credit}`}>
      Foto: {credit}
    </a>
  ) : (
    <span tabIndex={0} className={classes} title={`Foto: ${credit}`}>
      Foto: {credit}
    </span>
  );
}
