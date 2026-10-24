import React from 'react';
import { StepRowEditor } from './StepRowEditor';
import type { StepDraft } from '../types';

interface StepListEditorProps {
  rows: StepDraft[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, instruction: string) => void;
}

export function StepListEditor({
  rows,
  onAdd,
  onRemove,
  onUpdate,
}: StepListEditorProps): React.JSX.Element {
  return (
    <div className="p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1c1712] space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {rows.length} {rows.length === 1 ? 'paso' : 'pasos'}
        </p>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex min-h-9 items-center gap-1 rounded-md border border-zinc-200 px-3 text-xs font-medium text-zinc-700 transition-[background-color,transform] duration-150 ease-out-strong hover:bg-zinc-100 active:scale-[0.97] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          <span aria-hidden="true">+</span> Agregar paso
        </button>
      </div>

      <div className="space-y-3">
        {rows.map((row, index) => (
          <StepRowEditor
            key={index}
            step={row}
            canRemove={rows.length > 1}
            onChange={(instruction) => onUpdate(index, instruction)}
            onRemove={() => onRemove(index)}
          />
        ))}
      </div>
    </div>
  );
}
