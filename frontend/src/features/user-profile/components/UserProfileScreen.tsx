'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ROLE_LABELS, useSession } from '@/shared/session';
import { RecipeCard } from '@/features/recipe-feed';
import { useMyReactions } from '@/features/reactions';
import { useMyBookmarks } from '@/features/saved-recipes';
import { usePublicProfile } from '../hooks/usePublicProfile';
import { FollowButton } from './FollowButton';
import { ProfileHeader } from './ProfileHeader';
import { ProfileSkeleton } from '@/shared/components/ui/Skeleton';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { RecipeTile, RecipeTileGrid } from '@/shared/components/ui/RecipeTile';
import { cn } from '@/shared/lib/utils';

const dateFormatter = new Intl.DateTimeFormat('es-GT', { month: 'long', year: 'numeric' });

const linkButton =
  'inline-flex h-8 items-center rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#15110d] px-3 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900';

export function UserProfileScreen({ userId }: { userId: string }): React.JSX.Element {
  const { profile, recipes, isLoading, error, isToggling, followError, follow } = usePublicProfile(userId);
  const { user, status } = useSession();
  const myReactions = useMyReactions(recipes.map((r) => r.id));
  const myBookmarks = useMyBookmarks();
  // Cuadricula por defecto, como los perfiles de las redes sociales; la lista permite reaccionar sin abrir la receta
  const [view, setView] = useState<'grid' | 'list'>('grid');

  if (isLoading) {
    return <ProfileSkeleton label="Cargando perfil" />;
  }
  if (error || !profile) {
    return <p className="text-xs text-zinc-500 dark:text-zinc-400">{error ?? 'Perfil no encontrado.'}</p>;
  }

  const action =
    user?.id === profile.id ? (
      <Link href="/profile" className={linkButton}>
        Editar mi perfil
      </Link>
    ) : status === 'authenticated' ? (
      <FollowButton isFollowing={profile.isFollowing} isToggling={isToggling} onToggle={() => void follow()} />
    ) : (
      <Link href="/login" className={linkButton}>
        Inicia sesión para seguir
      </Link>
    );

  return (
    <div className="space-y-6">
      <ProfileHeader
        name={profile.name}
        avatarUrl={profile.avatarUrl}
        coverImageUrl={profile.coverImageUrl}
        subtitle={`${ROLE_LABELS[profile.role]} · En la comunidad desde ${dateFormatter.format(new Date(profile.createdAt))}`}
        bio={profile.bio}
        stats={{
          recipes: profile.publishedRecipesCount,
          followers: profile.followersCount,
          following: profile.followingCount,
        }}
        action={action}
      />

      {followError && <p className="text-xs text-zinc-700 dark:text-zinc-300">{followError}</p>}

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-serif text-lg font-semibold text-zinc-950 dark:text-zinc-50">Recetas publicadas</h2>
          {recipes.length > 0 && (
            <div className="flex shrink-0 rounded-md border border-zinc-200 p-0.5 dark:border-zinc-800" aria-label="Forma de ver las recetas">
              {(['grid', 'list'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setView(option)}
                  aria-pressed={view === option}
                  className={cn(
                    'min-h-8 rounded-md px-3 text-xs font-medium transition-colors duration-150',
                    view === option
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                      : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100',
                  )}
                >
                  {option === 'grid' ? 'Cuadrícula' : 'Lista'}
                </button>
              ))}
            </div>
          )}
        </div>
        {recipes.length === 0 ? (
          <EmptyState title="Todavía no ha publicado recetas" description="Cuando comparta sus recetas aparecerán aquí." />
        ) : view === 'grid' ? (
          <RecipeTileGrid>
            {recipes.map((recipe, index) => (
              <RecipeTile
                key={recipe.id}
                id={recipe.id}
                title={recipe.title}
                coverImageUrl={recipe.coverImageUrl}
                coverImageCredit={recipe.coverImageCredit}
                coverImageCreditUrl={recipe.coverImageCreditUrl}
                meta={`${recipe.prepTimeMinutes + recipe.cookTimeMinutes} min · ${recipe.originRegion}`}
                index={index}
              />
            ))}
          </RecipeTileGrid>
        ) : (
          <div className="space-y-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} userReaction={myReactions[recipe.id] ?? null} isBookmarked={myBookmarks.has(recipe.id)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
