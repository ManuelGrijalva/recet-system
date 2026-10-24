import React from 'react';
import { DIFFICULTY_LABELS, type Difficulty } from '@/shared/types';
import { ChartBarIcon, ClockIcon, UsersIcon } from '@/shared/components/ui/icons';

interface RecipeMetaTagsProps {
  totalTimeMinutes: number;
  servings: number;
  difficulty: Difficulty;
}

// Mismos iconos que el detalle de la receta para reconocer cada dato de un vistazo
function Tag({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }): React.JSX.Element {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
      <span aria-hidden="true" className="text-zinc-500 dark:text-zinc-400">
        {icon}
      </span>
      {children}
    </span>
  );
}

export function RecipeMetaTags({
  totalTimeMinutes,
  servings,
  difficulty,
}: RecipeMetaTagsProps): React.JSX.Element {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
      <Tag icon={<ClockIcon className="h-3.5 w-3.5" />}>{totalTimeMinutes} minutos</Tag>
      <Tag icon={<UsersIcon className="h-3.5 w-3.5" />}>{servings} porciones</Tag>
      <Tag icon={<ChartBarIcon className="h-3.5 w-3.5" />}>Dificultad: {DIFFICULTY_LABELS[difficulty]}</Tag>
    </div>
  );
}
