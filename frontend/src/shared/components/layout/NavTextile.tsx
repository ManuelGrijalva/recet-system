import React from 'react';
import { cn } from '../../lib/utils';
import { TextilePattern } from '../ui/TextilePattern';

// La seccion actual: Inicio solo en "/", las demas tambien en sus subrutas
export function isActiveRoute(pathname: string, href: string): boolean {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}

interface NavTextileProps {
  active: boolean;
}

// Fondo del boton: tejido gris al pasar el cursor y de colores al presionar o en la seccion actual.
// El Link que lo contiene debe llevar las clases "group relative overflow-hidden".
export function NavTextile({ active }: NavTextileProps): React.JSX.Element {
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 text-zinc-200 dark:text-zinc-800 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      >
        <TextilePattern />
      </span>
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 transition-opacity duration-200',
          active ? 'opacity-100' : 'opacity-0 group-active:opacity-100',
        )}
      >
        <TextilePattern variant="color" />
      </span>
    </>
  );
}

// Pastilla que mantiene legibles el icono y el texto sobre el tejido
export function navChipClass(active: boolean): string {
  return cn(
    'relative flex items-center rounded-md transition-colors duration-200',
    active
      ? 'bg-white text-zinc-950 shadow-sm dark:bg-[#0a0a0a] dark:text-zinc-50'
      : 'group-hover:bg-white/90 group-active:bg-white dark:group-hover:bg-[#0a0a0a]/90 dark:group-active:bg-[#0a0a0a]',
  );
}
