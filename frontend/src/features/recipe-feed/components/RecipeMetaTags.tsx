import React from 'react';
import { DIFFICULTY_LABELS, type Difficulty } from '@/shared/types';

interface RecipeMetaTagsProps {
  totalTimeMinutes: number;
  servings: number;
  difficulty: Difficulty;
}

function Tag({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <span className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
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
      <Tag>{totalTimeMinutes} minutos</Tag>
      <Tag>{servings} porciones</Tag>
      <Tag>Dificultad: {DIFFICULTY_LABELS[difficulty]}</Tag>
    </div>
  );
}
