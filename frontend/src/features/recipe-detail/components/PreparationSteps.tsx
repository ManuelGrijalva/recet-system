'use client';

import React, { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { CheckCircleSolidIcon, LightBulbIcon } from '@/shared/components/ui/icons';
import { useCookMode } from '../hooks/useCookMode';
import type { RecipeStep } from '../types';

interface PreparationStepsProps {
  steps: RecipeStep[];
}

// Paso a paso con numeros grandes; tocar un paso lo marca como hecho y el modo cocina evita que se apague la pantalla
export function PreparationSteps({
  steps,
}: PreparationStepsProps): React.JSX.Element {
  const [done, setDone] = useState<Set<number>>(() => new Set());
  const cookMode = useCookMode();

  const toggle = (stepNumber: number): void => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(stepNumber)) next.delete(stepNumber);
      else next.add(stepNumber);
      return next;
    });
  };

  return (
    <section className="space-y-4 rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#1c1712]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-lg font-semibold text-zinc-950 dark:text-zinc-50">Modo de preparación</h2>
        {cookMode.isSupported && (
          <button
            type="button"
            onClick={cookMode.toggle}
            aria-pressed={cookMode.isActive}
            className={cn(
              'inline-flex min-h-9 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-[color,background-color,border-color,transform] duration-150 ease-out-strong active:scale-[0.97] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
              cookMode.isActive
                ? 'border-brand bg-brand-soft text-brand-soft-foreground'
                : 'border-zinc-200 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900',
            )}
          >
            <LightBulbIcon className="h-4 w-4" />
            {cookMode.isActive ? 'Modo cocina activo' : 'Modo cocina'}
          </button>
        )}
      </div>
      {cookMode.isActive && (
        <p className="text-xs text-zinc-600 dark:text-zinc-400">La pantalla se mantendrá encendida mientras cocinas.</p>
      )}

      <ol className="space-y-2">
        {steps.map((step) => {
          const isDone = done.has(step.stepNumber);
          return (
            <li key={step.stepNumber}>
              <button
                type="button"
                onClick={() => toggle(step.stepNumber)}
                aria-pressed={isDone}
                className="flex w-full items-start gap-3 rounded-md p-2 text-left transition-colors duration-150 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:hover:bg-zinc-900"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-md font-serif text-base font-semibold transition-colors duration-150',
                    isDone ? 'bg-zinc-100 text-zinc-500 dark:bg-zinc-900' : 'bg-brand text-brand-foreground',
                  )}
                >
                  {isDone ? <CheckCircleSolidIcon className="h-5 w-5" /> : step.stepNumber}
                </span>
                <span
                  className={cn(
                    'pt-1 text-sm leading-relaxed transition-colors duration-150 sm:text-[15px]',
                    isDone ? 'text-zinc-400 line-through dark:text-zinc-600' : 'text-zinc-800 dark:text-zinc-200',
                  )}
                >
                  <span className="sr-only">Paso {step.stepNumber}: </span>
                  {step.instruction}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      {done.size > 0 && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400" aria-live="polite">
          {done.size} de {steps.length} pasos hechos
        </p>
      )}
    </section>
  );
}
