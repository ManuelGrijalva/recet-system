import React from 'react';
import { IngredientRowEditor } from './IngredientRowEditor';
import type { IngredientDraft } from '../types';

interface IngredientListEditorProps {
  rows: IngredientDraft[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof IngredientDraft, value: string) => void;
}

export function IngredientListEditor({
  rows,
  onAdd,
  onRemove,
  onUpdate,
}: IngredientListEditorProps): React.JSX.Element {
  return (
    <div className="p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
          Ingredientes
        </h2>
        <button
          type="button"
          onClick={onAdd}
          className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          Agregar ingrediente
        </button>
      </div>

      <div className="space-y-2.5">
        {rows.map((row, index) => (
          <IngredientRowEditor
            key={index}
            value={row}
            canRemove={rows.length > 1}
            onChange={(field, value) => onUpdate(index, field, value)}
            onRemove={() => onRemove(index)}
          />
        ))}
      </div>
    </div>
  );
}
