'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from '@/shared/session';
import { useProfileForm } from '../hooks/useProfileForm';
import { ProfileIdentityCard } from './ProfileIdentityCard';
import { ProfileContactForm } from './ProfileContactForm';

function ProfileContent(): React.JSX.Element {
  const { profile, values, isLoading, isSaving, feedback, setValue, save } =
    useProfileForm();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          Mi perfil de usuario
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Gestiona tus datos personales y configuración de privacidad en la plataforma.
        </p>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-medium text-zinc-900 dark:text-zinc-100">
          {feedback.message}
        </div>
      )}

      {isLoading || !profile ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Cargando tu perfil...</p>
      ) : (
        <>
          <ProfileIdentityCard profile={profile} />
          <ProfileContactForm
            values={values}
            email={profile.email}
            isSaving={isSaving}
            onChange={setValue}
            onSubmit={save}
          />
        </>
      )}
    </div>
  );
}

export function ProfileScreen(): React.JSX.Element {
  const { status } = useSession();

  if (status === 'loading') {
    return <p className="text-xs text-zinc-500 dark:text-zinc-400">Cargando tu perfil...</p>;
  }

  if (status === 'guest') {
    return (
      <div className="rounded-md border border-dashed border-zinc-200 dark:border-zinc-800 p-8 text-center space-y-3">
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          Inicia sesión con tu cuenta de Google para ver y editar tu perfil.
        </p>
        <Link
          href="/login"
          className="inline-flex h-9 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return <ProfileContent />;
}
