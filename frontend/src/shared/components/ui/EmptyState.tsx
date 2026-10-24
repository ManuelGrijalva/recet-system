import React from 'react';
import Link from 'next/link';
import { cn } from '../../lib/utils';
import { BrandMark } from './BrandMark';

interface EmptyStateProps {
  title: string;
  description?: React.ReactNode;
  // Accion sugerida; primary solo si es la unica accion relevante de la pantalla
  action?: { href: string; label: string; primary?: boolean };
  className?: string;
}

// Pantalla vacia con el comal: explica que pasa y sugiere el siguiente paso, nunca un recuadro en blanco
export function EmptyState({ title, description, action, className }: EmptyStateProps): React.JSX.Element {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-md border border-dashed border-zinc-300 bg-white/60 px-6 py-8 text-center dark:border-zinc-700 dark:bg-[#1c1712]/60',
        className,
      )}
    >
      <BrandMark size="lg" className="opacity-90" />
      <p className="mt-3 font-serif text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</p>
      {description && <p className="mt-1 max-w-sm text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">{description}</p>}
      {action && (
        <Link
          href={action.href}
          className={cn(
            'mt-4 inline-flex min-h-9 items-center rounded-md px-4 text-sm font-medium transition-[color,background-color,transform] duration-150 ease-out-strong active:scale-[0.97] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
            action.primary
              ? 'bg-brand text-brand-foreground hover:bg-brand-hover'
              : 'border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-[#15110d] dark:text-zinc-200 dark:hover:bg-zinc-800',
          )}
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
