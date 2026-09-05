import React from 'react';
import type { RecipeStep } from '../types';

interface PreparationStepsProps {
  steps: RecipeStep[];
}

export function PreparationSteps({
  steps,
}: PreparationStepsProps): React.JSX.Element {
  return (
    <div className="p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] space-y-3">
      <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
        Modo de preparación
      </h2>
      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.stepNumber} className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              {step.stepNumber}
            </span>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed pt-0.5">
              {step.instruction}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
