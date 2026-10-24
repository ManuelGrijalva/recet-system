import React from 'react';
import { cn } from '@/shared/lib/utils';
import { CheckCircleIcon } from '@/shared/components/ui/icons';
import { capitalizeIngredientName } from '../lib/capitalizeIngredientName';

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
        Ingredientes más usados en las recetas
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
                'inline-flex min-h-10 items-center gap-1 rounded-md border px-3.5 text-sm font-medium sm:min-h-8 sm:px-3 sm:text-xs transition-[color,background-color,border-color,transform] duration-150 ease-out-strong active:scale-[0.97] motion-reduce:active:scale-100',
                selected
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-xs'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900',
              )}
            >
              {selected && <CheckCircleIcon className="w-3 h-3 animate-pop-in" />}
              {capitalizeIngredientName(ingredient)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
