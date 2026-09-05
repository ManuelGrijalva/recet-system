import React from 'react';
import { Avatar } from '@/shared/components/ui/Avatar';
import { EllipsisIcon } from '@/shared/components/ui/icons';
import type { AuthorSummary } from '@/shared/types';

interface RecipeCardAuthorProps {
  author: AuthorSummary;
  originRegion: string;
}

export function RecipeCardAuthor({
  author,
  originRegion,
}: RecipeCardAuthorProps): React.JSX.Element {
  return (
    <div className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar
          src={author.avatarUrl}
          alt={author.name}
          fallbackName={author.name}
          size="md"
        />
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
            {author.name}
          </h3>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            {originRegion}
          </p>
        </div>
      </div>
      <button
        type="button"
        className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
        aria-label="Opciones de receta"
      >
        <EllipsisIcon />
      </button>
    </div>
  );
}
