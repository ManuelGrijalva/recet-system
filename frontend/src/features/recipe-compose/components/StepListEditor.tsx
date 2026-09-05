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
    <div className="p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
          Pasos de preparación
        </h2>
        <button
          type="button"
          onClick={onAdd}
          className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          Agregar paso
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
