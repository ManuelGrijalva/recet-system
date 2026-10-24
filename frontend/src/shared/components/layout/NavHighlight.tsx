import React from 'react';
import { cn } from '../../lib/utils';

// La seccion actual: Inicio solo en "/", las demas tambien en sus subrutas
export function isActiveRoute(pathname: string, href: string): boolean {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}

interface NavHighlightProps {
  active: boolean;
  // left: barra lateral de escritorio; top: barra inferior del celular
  placement: 'left' | 'top';
}

// Fondo del boton: tinte arena al pasar el cursor y tarjeta clara con marca Brasa en la seccion actual.
// El Link que lo contiene debe llevar las clases "group relative".
export function NavHighlight({ active, placement }: NavHighlightProps): React.JSX.Element {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 rounded-md border transition-colors duration-150',
        active
          ? 'border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-[#1c1712]'
          : 'border-transparent group-hover:bg-zinc-100 group-active:bg-zinc-200 dark:group-hover:bg-zinc-900 dark:group-active:bg-zinc-800',
      )}
    >
      {active && (
        <span
          className={cn(
            'absolute bg-brand',
            placement === 'left' ? 'left-0 top-2 bottom-2 w-1 rounded-r-sm' : 'top-0 left-3 right-3 h-0.5 rounded-b-sm',
          )}
        />
      )}
    </span>
  );
}

// Contenido del boton por encima del fondo
export function navChipClass(active: boolean): string {
  return cn('relative flex items-center rounded-md', active ? 'text-zinc-950 dark:text-zinc-50' : undefined);
}
