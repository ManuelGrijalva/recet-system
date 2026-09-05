import React from 'react';
import { cn } from '@/shared/lib/utils';
import { CheckCircleIcon } from '@/shared/components/ui/icons';

interface IngredientChipsProps {
  options: string[];
  isSelected: (name: string) => boolean;
  onToggle: (name: string) => void;
}

export function IngredientChips({
  options,
  isSelected,
  onToggle,
}: IngredientChipsProps): React.JSX.Element {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
        Ingredientes tradicionales comunes
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((ingredient) => {
          const selected = isSelected(ingredient);
          return (
            <button
              key={ingredient}
              type="button"
              onClick={() => onToggle(ingredient)}
              aria-pressed={selected}
              className={cn(
                'inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md font-medium border transition-colors',
                selected
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-xs'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900',
              )}
            >
              {selected && <CheckCircleIcon className="w-3 h-3" />}
              {ingredient}
            </button>
          );
        })}
      </div>
    </div>
  );
}
