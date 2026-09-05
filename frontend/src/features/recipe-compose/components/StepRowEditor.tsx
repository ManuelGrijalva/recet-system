import React from 'react';
import { XIcon } from '@/shared/components/ui/icons';
import type { StepDraft } from '../types';

interface StepRowEditorProps {
  step: StepDraft;
  canRemove: boolean;
  onChange: (instruction: string) => void;
  onRemove: () => void;
}

export function StepRowEditor({
  step,
  canRemove,
  onChange,
  onRemove,
}: StepRowEditorProps): React.JSX.Element {
  return (
    <div className="flex items-start gap-2.5">
      <span className="w-6 h-6 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold flex items-center justify-center shrink-0 mt-1">
        {step.stepNumber}
      </span>
      <textarea
        placeholder={`Describe la instrucción del paso ${step.stepNumber}...`}
        value={step.instruction}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="flex-1 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] p-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 resize-none"
        required
      />
      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 mt-1"
          aria-label="Eliminar paso"
        >
          <XIcon />
        </button>
      )}
    </div>
  );
}
