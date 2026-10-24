import React, { useId } from 'react';
import { cn } from '../../lib/utils';

interface TextileBandProps {
  // 1 = 16 px de grosor; 0.5 = 8 px (divisor fino)
  scale?: number;
  // Vertical: borde tejido de las columnas laterales
  vertical?: boolean;
  className?: string;
}

// Franja tejida a color (terracota, ocre y marrón); solo decoración de portada y divisores, nunca en botones
export function TextileBand({ scale = 1, vertical = false, className }: TextileBandProps): React.JSX.Element {
  const id = useId().replace(/:/g, '');

  return (
    <svg
      className={cn('block', vertical ? 'h-full' : 'w-full', className)}
      style={vertical ? { width: 16 * scale } : { height: 16 * scale }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id={`banda-${id}`} width="32" height="16" patternUnits="userSpaceOnUse" patternTransform={vertical ? `rotate(90) scale(${scale})` : `scale(${scale})`}>
          <rect width="32" height="16" className="fill-brand" />
          <rect width="32" height="2" className="fill-zinc-900" />
          <rect y="14" width="32" height="2" className="fill-zinc-900" />
          <path d="M16 3 L25 8 L16 13 L7 8 Z" className="fill-ochre" />
          <path d="M16 6 L20 8 L16 10 L12 8 Z" className="fill-zinc-900" />
          <rect x="0" y="7" width="3" height="2" className="fill-ochre" />
          <rect x="29" y="7" width="3" height="2" className="fill-ochre" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#banda-${id})`} />
    </svg>
  );
}
