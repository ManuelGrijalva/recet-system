import React from 'react';
import { DIFFICULTY_LABELS, type Difficulty } from '@/shared/types';

interface RecipeCookingMetaProps {
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: Difficulty;
}

function Cell({
  label,
  value,
}: {
  label: string;
  value: string;
}): React.JSX.Element {
  return (
    <div>
      <span className="text-zinc-500 dark:text-zinc-400 block text-[10px]">
        {label}
      </span>
      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
        {value}
      </span>
    </div>
  );
}

export function RecipeCookingMeta({
  prepTimeMinutes,
  cookTimeMinutes,
  servings,
  difficulty,
}: RecipeCookingMetaProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-xs">
      <Cell label="Preparación" value={`${prepTimeMinutes} min`} />
      <Cell label="Cocción" value={`${cookTimeMinutes} min`} />
      <Cell label="Rendimiento" value={`${servings} porciones`} />
      <Cell label="Dificultad" value={DIFFICULTY_LABELS[difficulty]} />
    </div>
  );
}
