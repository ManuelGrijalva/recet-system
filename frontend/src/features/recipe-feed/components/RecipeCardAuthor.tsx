import React from 'react';
import Link from 'next/link';
import { Avatar } from '@/shared/components/ui/Avatar';
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
      <Link href={`/user/${author.id}`} className="flex items-center gap-3 group">
        <Avatar
          src={author.avatarUrl}
          alt={author.name}
          fallbackName={author.name}
          size="md"
        />
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-tight group-hover:underline">
            {author.name}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {originRegion}
          </p>
        </div>
      </Link>
    </div>
  );
}
