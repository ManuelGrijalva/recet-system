import React from 'react';
import { Avatar } from '@/shared/components/ui/Avatar';
import type { RecipeDetail } from '../types';

interface RecipeDetailHeaderProps {
  recipe: RecipeDetail;
}

export function RecipeDetailHeader({
  recipe,
}: RecipeDetailHeaderProps): React.JSX.Element {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span>{recipe.originRegion}</span>
        <span>•</span>
        <span>Tradición viva</span>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">
        {recipe.title}
      </h1>

      <div className="flex items-center gap-3 pt-1">
        <Avatar
          src={recipe.author.avatarUrl}
          alt={recipe.author.name}
          fallbackName={recipe.author.name}
          size="md"
        />
        <div>
          <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            {recipe.author.name}
          </p>
          {recipe.author.role && (
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {recipe.author.role}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
