'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/shared/lib/utils';
import { ROLE_LABELS, useSession } from '@/shared/session';
import { Button } from '@/shared/components/ui/Button';
import { Notice } from '@/shared/components/ui/Notice';
import { MyRecipesSection } from '@/features/my-recipes';
import { ContributorRequestSection } from '@/features/contributor-request';
import { ProfileHeader } from '@/features/user-profile';
import { useSavedRecipes } from '@/features/saved-recipes';
import { RecipeTile, RecipeTileGrid } from '@/shared/components/ui/RecipeTile';
import { CookbookPdfButton } from '@/features/recipe-export';
import { useProfileForm } from '../hooks/useProfileForm';
import { ProfileEditModal } from './ProfileEditModal';
import type { UserProfile } from '../types';
import { SkeletonList, ProfileSkeleton } from '@/shared/components/ui/Skeleton';
import { EmptyState } from '@/shared/components/ui/EmptyState';

type ProfileTab = 'recipes' | 'saved' | 'about';

const dateFormatter = new Intl.DateTimeFormat('es-GT', { month: 'long', year: 'numeric' });

function SavedTab(): React.JSX.Element {
  const { recipes, isLoading, error } = useSavedRecipes();

  if (isLoading) return <SkeletonList rows={3} label="Cargando tu recetario" />;
  if (error) return <p className="text-xs text-zinc-700 dark:text-zinc-300">{error}</p>;
  if (recipes.length === 0) {
    return (
      <EmptyState
        title="Tu recetario está vacío"
        description="Guarda las recetas que quieras cocinar y aparecerán aquí."
        action={{ href: '/', label: 'Explorar recetas' }}
      />
    );
  }
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <CookbookPdfButton />
      </div>
      <RecipeTileGrid>
        {recipes.map((recipe, index) => (
          <RecipeTile
        key={recipe.id}
        id={recipe.id}
        title={recipe.title}
        coverImageUrl={recipe.coverImageUrl}
        coverImageCredit={recipe.coverImageCredit}
        coverImageCreditUrl={recipe.coverImageCreditUrl}
        meta={`${recipe.timeMinutes} min · ${recipe.author}`}
        index={index}
          />
        ))}
      </RecipeTileGrid>
    </div>
  );
}

function AboutTab({ profile }: { profile: UserProfile }): React.JSX.Element {
  const rows: { label: string; value: string; note?: string }[] = [
    { label: 'Correo', value: profile.email, note: 'Vinculado a tu cuenta de Google' },
    { label: 'Teléfono', value: profile.phone ?? 'Sin registrar', note: 'Privado: nadie más lo ve' },
    { label: 'Rol', value: ROLE_LABELS[profile.role] },
    { label: 'En la comunidad desde', value: dateFormatter.format(new Date(profile.createdAt)) },
  ];
  return (
    <dl className="divide-y divide-zinc-100 dark:divide-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#15110d] px-4">
      {rows.map((row) => (
        <div key={row.label} className="py-3 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
          <dt className="text-xs text-zinc-500 dark:text-zinc-400">{row.label}</dt>
          <dd className="text-sm text-zinc-900 dark:text-zinc-100 sm:text-right">
            {row.value}
            {row.note && <span className="block text-xs text-zinc-500 dark:text-zinc-400">{row.note}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function ProfileContent(): React.JSX.Element {
  const { profile, stats, values, isLoading, isSaving, uploading, feedback, setValue, resetValues, save, changeImage } =
    useProfileForm();
  const { hasRole } = useSession();
  const canPublish = hasRole('CONTRIBUTOR', 'ADMIN');
  const [tab, setTab] = useState<ProfileTab>(canPublish ? 'recipes' : 'saved');
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading || !profile) {
    return <ProfileSkeleton label="Cargando tu perfil" />;
  }

  const tabs: { id: ProfileTab; label: string }[] = [
    ...(canPublish ? [{ id: 'recipes' as const, label: 'Mis recetas' }] : []),
    { id: 'saved', label: 'Guardadas' },
    { id: 'about', label: 'Información' },
  ];

  return (
    <div className="space-y-6">
      <ProfileHeader
        name={profile.name}
        avatarUrl={profile.avatarUrl}
        coverImageUrl={profile.coverImageUrl}
        subtitle={ROLE_LABELS[profile.role]}
        bio={profile.bio}
        stats={stats}
        editing={{ isUploading: uploading, onPickImage: (kind, file) => void changeImage(kind, file) }}
        action={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              Editar perfil
            </Button>
            <Link
              href={`/user/${profile.id}`}
              className="inline-flex h-8 items-center rounded-md px-3 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              Ver como público
            </Link>
          </div>
        }
      />

      {feedback && (
        <Notice tone={feedback.ok ? 'success' : 'danger'} role="status" className="font-medium">
          {feedback.message}
        </Notice>
      )}

      {!profile.bio && (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="w-full rounded-md border border-dashed border-zinc-300 dark:border-zinc-700 p-4 text-left text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
        >
          Agrega una presentación: cuéntale a la comunidad de dónde eres y qué recetas guardas en tu memoria.
        </button>
      )}

      {hasRole('USER') && <ContributorRequestSection />}

      <div>
        <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-zinc-200 dark:border-zinc-800">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                '-mb-px shrink-0 px-3 py-2 text-sm font-medium border-b-2 transition-colors',
                tab === t.id
                  ? 'border-zinc-900 dark:border-zinc-100 text-zinc-950 dark:text-zinc-50'
                  : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="pt-4">
          {tab === 'recipes' && <MyRecipesSection />}
          {tab === 'saved' && <SavedTab />}
          {tab === 'about' && <AboutTab profile={profile} />}
        </div>
      </div>

      <ProfileEditModal
        isOpen={isEditing}
        values={values}
        isSaving={isSaving}
        onChange={setValue}
        onClose={() => {
          resetValues();
          setIsEditing(false);
        }}
        onSubmit={() => {
          void save().then((ok) => {
            if (ok) setIsEditing(false);
          });
        }}
      />
    </div>
  );
}

export function ProfileScreen(): React.JSX.Element {
  const { status } = useSession();

  if (status === 'loading') {
    return <ProfileSkeleton label="Cargando tu perfil" />;
  }

  if (status === 'guest') {
    return (
      <EmptyState
        title="Tu perfil de cocinero"
        description="Inicia sesión con tu cuenta de Google para ver y editar tu perfil."
        action={{ href: '/login', label: 'Iniciar sesión', primary: true }}
      />
    );
  }

  return <ProfileContent />;
}
