'use client';

import React from 'react';
import Link from 'next/link';
import { ROLE_LABELS, useSession } from '@/shared/session';
import { RecipeCard } from '@/features/recipe-feed';
import { useMyReactions } from '@/features/reactions';
import { usePublicProfile } from '../hooks/usePublicProfile';
import { FollowButton } from './FollowButton';
import { ProfileHeader } from './ProfileHeader';

const dateFormatter = new Intl.DateTimeFormat('es-GT', { month: 'long', year: 'numeric' });

const linkButton =
  'inline-flex h-8 items-center rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] px-3 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900';

export function UserProfileScreen({ userId }: { userId: string }): React.JSX.Element {
  const { profile, recipes, isLoading, error, isToggling, followError, follow } = usePublicProfile(userId);
  const { user, status } = useSession();
  const myReactions = useMyReactions(recipes.map((r) => r.id));

  if (isLoading) {
    return <p className="text-xs text-zinc-500 dark:text-zinc-400">Cargando perfil...</p>;
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
        <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">Recetas publicadas</h2>
        {recipes.length === 0 ? (
          <div className="rounded-md border border-dashed border-zinc-200 dark:border-zinc-800 p-8 text-center">
            <p className="text-xs text-zinc-500">Todavía no ha publicado recetas.</p>
          </div>
        ) : (
          recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} userReaction={myReactions[recipe.id] ?? null} />
          ))
        )}
      </section>
    </div>
  );
}
