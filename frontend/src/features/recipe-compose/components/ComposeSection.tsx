import React from 'react';
import { cn } from '@/shared/lib/utils';
import { CheckCircleSolidIcon } from '@/shared/components/ui/icons';

interface ComposeSectionProps {
  number: number;
  title: string;
  hint: string;
  // Lista para publicar: el numero cambia a una marca de verificacion
  done: boolean;
  optional?: boolean;
  children: React.ReactNode;
}

// Seccion numerada del formulario de publicacion; muestra el avance sin depender solo del color
export function ComposeSection({ number, title, hint, done, optional = false, children }: ComposeSectionProps): React.JSX.Element {
  const headingId = `compose-section-${number}`;

  return (
    <section aria-labelledby={headingId} className="space-y-3">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-md font-serif text-base font-semibold transition-colors duration-200',
            done ? 'bg-success-soft text-success-soft-foreground' : 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900',
          )}
        >
          {done ? <CheckCircleSolidIcon className="h-5 w-5" /> : number}
        </span>
        <div className="min-w-0">
          <h2 id={headingId} className="font-serif text-lg font-semibold leading-tight text-zinc-950 dark:text-zinc-50">
            {title}
            {optional && <span className="ml-2 align-middle font-sans text-xs font-normal text-zinc-500 dark:text-zinc-400">Opcional</span>}
            <span className="sr-only">{done ? ' (completa)' : ' (pendiente)'}</span>
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">{hint}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
