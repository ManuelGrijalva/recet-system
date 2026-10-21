'use client';

import React from 'react';
import Link from 'next/link';
import { Avatar } from '@/shared/components/ui/Avatar';
import { ROLE_LABELS, useSession } from '@/shared/session';
import { RecipeCard } from '@/features/recipe-feed';
import { useMyReactions } from '@/features/reactions';
import { usePublicProfile } from '../hooks/usePublicProfile';
import { FollowButton } from './FollowButton';

const dateFormatter = new Intl.DateTimeFormat('es-GT', { month: 'long', year: 'numeric' });

function Stat({ value, label }: { value: number; label: string }): React.JSX.Element {
  return (
    <div>
      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{value}</p>
      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{label}</p>
    </div>
  );
}

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

  const isOwnProfile = user?.id === profile.id;

  return (
    <div className="space-y-6">
      <section className="p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] space-y-4">
        <div className="flex items-center gap-3">
          <Avatar src={profile.avatarUrl} alt={profile.name} fallbackName={profile.name} size="lg" />
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-zinc-50 truncate">{profile.name}</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {ROLE_LABELS[profile.role]} · Desde {dateFormatter.format(new Date(profile.createdAt))}
            </p>
          </div>
          {isOwnProfile ? (
            <Link
              href="/profile"
              className="inline-flex h-8 items-center rounded-md border border-zinc-200 dark:border-zinc-800 px-3 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              Editar mi perfil
            </Link>
          ) : status === 'authenticated' ? (
            <FollowButton isFollowing={profile.isFollowing} isToggling={isToggling} onToggle={() => void follow()} />
          ) : (
            <Link
              href="/login"
              className="inline-flex h-8 items-center rounded-md bg-zinc-900 dark:bg-zinc-100 px-3 text-xs font-medium text-white dark:text-zinc-900"
            >
              Inicia sesión para seguir
            </Link>
          )}
        </div>

        <div className="flex gap-8">
          <Stat value={profile.publishedRecipesCount} label="Recetas" />
          <Stat value={profile.followersCount} label="Seguidores" />
          <Stat value={profile.followingCount} label="Siguiendo" />
        </div>

        {followError && <p className="text-xs text-zinc-700 dark:text-zinc-300">{followError}</p>}
      </section>

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
