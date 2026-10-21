import React from 'react';
import { XIcon } from '@/shared/components/ui/icons';
import { capitalizeIngredientName } from '../lib/capitalizeIngredientName';

interface SelectedIngredientsProps {
  selected: string[];
  onRemove: (name: string) => void;
}

// Todo lo que entra a la busqueda, incluso lo escrito a mano
export function SelectedIngredients({ selected, onRemove }: SelectedIngredientsProps): React.JSX.Element {
  if (selected.length === 0) {
    return (
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Aún no has elegido ingredientes. Escribe los que tienes o tócalos en la lista de abajo.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Tus ingredientes ({selected.length})</p>
      <div className="flex flex-wrap gap-2">
        {selected.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => onRemove(name)}
            aria-label={`Quitar ${name}`}
            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md font-medium bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            {capitalizeIngredientName(name)}
            <XIcon className="w-3 h-3" />
          </button>
        ))}
      </div>
    </div>
  );
}
