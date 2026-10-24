import React from 'react';
import { DIFFICULTY_LABELS, type Difficulty } from '@/shared/types';
import { ChartBarIcon, ClockIcon, FireIcon, UsersIcon } from '@/shared/components/ui/icons';

interface RecipeCookingMetaProps {
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: Difficulty;
}

function Cell({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}): React.JSX.Element {
  return (
    <div className="flex items-center gap-2.5">
      <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
        {icon}
      </span>
      <span>
        <span className="block text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
        <span className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">{value}</span>
      </span>
    </div>
  );
}

// Datos rapidos de la receta con icono, al estilo de las fichas de recetarios en linea
export function RecipeCookingMeta({
  prepTimeMinutes,
  cookTimeMinutes,
  servings,
  difficulty,
}: RecipeCookingMetaProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-3 rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#1c1712] sm:grid-cols-4">
      <Cell icon={<ClockIcon className="h-[18px] w-[18px]" />} label="Preparación" value={`${prepTimeMinutes} min`} />
      <Cell icon={<FireIcon className="h-[18px] w-[18px]" />} label="Cocción" value={`${cookTimeMinutes} min`} />
      <Cell icon={<UsersIcon className="h-[18px] w-[18px]" />} label="Rendimiento" value={`${servings} porciones`} />
      <Cell icon={<ChartBarIcon className="h-[18px] w-[18px]" />} label="Dificultad" value={DIFFICULTY_LABELS[difficulty]} />
    </div>
  );
}
