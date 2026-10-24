import React from 'react';
import Link from 'next/link';
import { Avatar } from '@/shared/components/ui/Avatar';
import type { AuthorSummary } from '@/shared/types';
import type { FeedRecipe } from '../types';

const MAX_COOKS = 10;

// Autores distintos de las recetas cargadas, en el orden en que aparecen
function uniqueAuthors(recipes: FeedRecipe[]): AuthorSummary[] {
  const seen = new Map<string, AuthorSummary>();
  for (const recipe of recipes) {
    if (!seen.has(recipe.author.id)) seen.set(recipe.author.id, recipe.author);
  }
  return [...seen.values()].slice(0, MAX_COOKS);
}

// Fila de cocineros de la comunidad, al estilo de las historias; sale de las recetas del feed, sin consulta propia
export function CommunityCooks({ recipes }: { recipes: FeedRecipe[] }): React.JSX.Element | null {
  const authors = uniqueAuthors(recipes);
  if (authors.length < 2) return null;

  return (
    <section aria-label="Cocineros de la comunidad" className="space-y-2">
      <h2 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Cocineros de la comunidad</h2>
      <ul className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
        {authors.map((author) => (
          <li key={author.id} className="shrink-0">
            <Link
              href={`/user/${author.id}`}
              className="group flex w-16 flex-col items-center gap-1 rounded-md py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <span className="rounded-full border-2 border-ochre p-0.5 transition-colors duration-150 group-hover:border-brand">
                <Avatar src={author.avatarUrl} alt={author.name} fallbackName={author.name} size="lg" />
              </span>
              <span className="w-full truncate text-center text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {author.name.split(' ')[0]}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
