'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '../../lib/apiClient';
import { useSession } from '../../session';
import type { AuthorSummary, ReactionCounts } from '../../types';
import { Avatar } from '../ui/Avatar';
import { RecipeThumb } from '../ui/RecipeThumb';
import { TextileBand } from '../ui/TextileBand';
import { SkeletonList } from '../ui/Skeleton';
import { TextilePattern } from '../ui/TextilePattern';

// Subconjunto de FeedRecipeItem del backend que usa la columna
interface SidebarRecipe {
  id: string;
  title: string;
  coverImageUrl: string | null;
  coverImageCredit?: string | null;
  author: AuthorSummary;
  reactionCounts: ReactionCounts;
  commentsCount: number;
}

interface Cook {
  author: AuthorSummary;
  recipes: number;
}

const SAMPLE_SIZE = 30;

function reactions(recipe: SidebarRecipe): number {
  const { like, yummy, triedIt } = recipe.reactionCounts;
  return like + yummy + triedIt;
}

// Tendencias: las recetas con mas reacciones y comentarios entre las recientes
function trending(recipes: SidebarRecipe[]): SidebarRecipe[] {
  const score = (recipe: SidebarRecipe): number => reactions(recipe) + recipe.commentsCount;
  return [...recipes]
    .filter((recipe) => score(recipe) > 0)
    .sort((a, b) => score(b) - score(a))
    .slice(0, 5);
}

// Cocineros recomendados: quienes mas recetas comparten, sin incluir a quien mira
function recommendedCooks(recipes: SidebarRecipe[], viewerId: string | undefined): Cook[] {
  const byAuthor = new Map<string, Cook>();
  for (const recipe of recipes) {
    if (recipe.author.id === viewerId) continue;
    const cook = byAuthor.get(recipe.author.id) ?? { author: recipe.author, recipes: 0 };
    cook.recipes += 1;
    byAuthor.set(recipe.author.id, cook);
  }
  return [...byAuthor.values()].sort((a, b) => b.recipes - a.recipes).slice(0, 4);
}

function SidebarCard({ title, children }: { title: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <section className="shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-[#1c1712]">
      <TextileBand scale={0.375} />
      <div className="p-4">
        <h2 className="mb-3 font-serif text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
        {children}
      </div>
    </section>
  );
}

// Columna derecha de escritorio: tendencias de Jutiapa y cocineros recomendados, como en el prototipo de la tesis
export function RightSidebar(): React.JSX.Element {
  const { user } = useSession();
  const [recipes, setRecipes] = useState<SidebarRecipe[] | null>(null);

  useEffect(() => {
    let active = true;
    apiClient<{ items: SidebarRecipe[] }>('recipes/feed', { params: { page: 1, limit: SAMPLE_SIZE } })
      .then((data) => {
        if (active) setRecipes(data.items);
      })
      .catch(() => {
        if (active) setRecipes([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const top = recipes ? trending(recipes) : [];
  const cooks = recipes ? recommendedCooks(recipes, user?.id) : [];

  return (
    <aside className="print:hidden hidden lg:flex flex-col gap-6 w-80 h-screen fixed right-0 top-0 border-l border-zinc-200 dark:border-zinc-800 bg-background px-6 py-6 z-40 overflow-y-auto">
      <TextileBand vertical scale={0.375} className="fixed inset-y-0 right-80 z-10" />
      <SidebarCard title="Tendencias en Jutiapa">
        {recipes === null ? (
          <SkeletonList rows={4} label="Cargando tendencias" />
        ) : top.length === 0 ? (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Reacciona a las recetas para que aparezcan aquí.</p>
        ) : (
          <ol className="space-y-3">
            {top.map((recipe) => (
              <li key={recipe.id}>
                <Link
                  href={`/recipe/${recipe.id}`}
                  className="group flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <RecipeThumb coverImageUrl={recipe.coverImageUrl} coverImageCredit={recipe.coverImageCredit} className="h-12 w-12" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-zinc-900 group-hover:underline dark:text-zinc-100">
                      {recipe.title}
                    </span>
                    <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                      {reactions(recipe)} {reactions(recipe) === 1 ? 'reacción' : 'reacciones'} · {recipe.commentsCount}{' '}
                      {recipe.commentsCount === 1 ? 'comentario' : 'comentarios'}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </SidebarCard>

      <SidebarCard title="Cocineros recomendados">
        {recipes === null ? (
          <SkeletonList rows={3} label="Cargando cocineros" />
        ) : cooks.length === 0 ? (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Aún no hay cocineros para recomendar.</p>
        ) : (
          <ul className="space-y-3">
            {cooks.map(({ author, recipes: count }) => (
              <li key={author.id}>
                <Link
                  href={`/user/${author.id}`}
                  className="group flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <span className="rounded-full border-2 border-ochre p-0.5">
                    <Avatar src={author.avatarUrl} alt={author.name} fallbackName={author.name} size="md" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-zinc-900 group-hover:underline dark:text-zinc-100">
                      {author.name}
                    </span>
                    <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                      {count} {count === 1 ? 'receta compartida' : 'recetas compartidas'}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </SidebarCard>

      <div className="shrink-0 rounded-md border border-zinc-200 bg-white p-4 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-[#1c1712] dark:text-zinc-400">
        <p className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">Patrimonio vivo</p>
        <p className="leading-relaxed">
          El tamal de viaje acompañaba al pueblo xinca en sus jornadas largas: no lleva relleno para conservarse más tiempo.
          Fuente: Sistema de Información Cultural, Ministerio de Cultura y Deportes.
        </p>
      </div>

      {/* Huipil de fondo en el espacio libre del final */}
      <div
        aria-hidden="true"
        className="relative min-h-24 flex-1 shrink-0 overflow-hidden text-zinc-200 dark:text-zinc-800 [mask-image:linear-gradient(to_bottom,transparent,black_30%)]"
      >
        <TextilePattern />
      </div>
    </aside>
  );
}
