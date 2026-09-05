import React from 'react';
import { XIcon } from '@/shared/components/ui/icons';
import type { IngredientDraft } from '../types';

interface IngredientRowEditorProps {
  value: IngredientDraft;
  canRemove: boolean;
  onChange: (field: keyof IngredientDraft, value: string) => void;
  onRemove: () => void;
}

const FIELD_CLASS =
  'h-9 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400';

export function IngredientRowEditor({
  value,
  canRemove,
  onChange,
  onRemove,
}: IngredientRowEditorProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Nombre (ej. Queso criollo)"
        value={value.name}
        onChange={(e) => onChange('name', e.target.value)}
        className={`flex-1 px-3 ${FIELD_CLASS}`}
        required
      />
      <input
        type="text"
        placeholder="Cantidad (ej. 1/2)"
        value={value.quantity}
        onChange={(e) => onChange('quantity', e.target.value)}
        className={`w-24 px-2.5 ${FIELD_CLASS}`}
        required
      />
      <input
        type="text"
        placeholder="Unidad (ej. libra)"
        value={value.unit}
        onChange={(e) => onChange('unit', e.target.value)}
        className={`w-24 px-2.5 ${FIELD_CLASS}`}
        required
      />
      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          aria-label="Eliminar ingrediente"
        >
          <XIcon />
        </button>
      )}
    </div>
  );
}
