'use client';

import React from 'react';
import { useProfileForm } from '../hooks/useProfileForm';
import { ProfileIdentityCard } from './ProfileIdentityCard';
import { ProfileContactForm } from './ProfileContactForm';

export function ProfileScreen(): React.JSX.Element {
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
