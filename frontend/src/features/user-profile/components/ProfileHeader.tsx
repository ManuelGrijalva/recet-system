'use client';

import React from 'react';
import { Avatar } from '@/shared/components/ui/Avatar';
import { TextilePattern } from '@/shared/components/ui/TextilePattern';
import { CameraIcon } from '@/shared/components/ui/icons';

export interface ProfileHeaderStats {
  recipes: number;
  followers: number;
  following: number;
}

// Solo en el perfil propio: permite cambiar las fotos
export interface ProfileHeaderEditing {
  isUploading: 'avatar' | 'cover' | null;
  onPickImage: (kind: 'avatar' | 'cover', file: File) => void;
}

interface ProfileHeaderProps {
  name: string;
  avatarUrl: string | null;
  coverImageUrl: string | null;
  subtitle: string;
  bio: string | null;
  stats: ProfileHeaderStats | null;
  action?: React.ReactNode;
  editing?: ProfileHeaderEditing;
}

function PhotoInput({ onPick }: { onPick: (file: File) => void }): React.JSX.Element {
  return (
    <input
      type="file"
      accept="image/jpeg,image/png,image/webp"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) onPick(file);
        e.target.value = '';
      }}
    />
  );
}

function Stat({ value, label }: { value: number; label: string }): React.JSX.Element {
  return (
    <p className="text-xs text-zinc-500 dark:text-zinc-400">
      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{value}</span> {label}
    </p>
  );
}

// Encabezado al estilo de una red social: portada, foto superpuesta, nombre, presentacion y contadores
export function ProfileHeader({
  name,
  avatarUrl,
  coverImageUrl,
  subtitle,
  bio,
  stats,
  action,
  editing,
}: ProfileHeaderProps): React.JSX.Element {
  return (
    <section className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#15110d] overflow-hidden">
      <div className="relative h-36 sm:h-48 bg-zinc-100 dark:bg-zinc-900 text-zinc-300 dark:text-zinc-700">
        {coverImageUrl ? (
          <img src={coverImageUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <TextilePattern />
        )}
        {editing && (
          <label
            className="absolute right-3 bottom-3 inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-white/90 dark:bg-zinc-900/90 px-3 py-1.5 text-xs font-medium text-zinc-800 dark:text-zinc-200 shadow-sm hover:bg-white dark:hover:bg-zinc-900"
          >
            <CameraIcon className="w-3.5 h-3.5" />
            {editing.isUploading === 'cover' ? 'Subiendo...' : coverImageUrl ? 'Cambiar portada' : 'Agregar portada'}
            <PhotoInput onPick={(file) => editing.onPickImage('cover', file)} />
          </label>
        )}
      </div>

      <div className="px-4 sm:px-5 pb-5">
        <div className="flex items-end justify-between gap-3 -mt-10 sm:-mt-12">
          <div className="relative">
            <div className="rounded-full ring-4 ring-white dark:ring-[#15110d] bg-white dark:bg-[#15110d]">
              <Avatar src={avatarUrl} alt={name} fallbackName={name} size="xl" />
            </div>
            {editing && (
              <label
                className="absolute bottom-0 right-0 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                aria-label="Cambiar foto de perfil"
                title="Cambiar foto de perfil"
              >
                {editing.isUploading === 'avatar' ? (
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <CameraIcon className="w-4 h-4" />
                )}
                <PhotoInput onPick={(file) => editing.onPickImage('avatar', file)} />
              </label>
            )}
          </div>
          {action && <div className="pb-1">{action}</div>}
        </div>

        <div className="mt-3 space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">{name}</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</p>
        </div>

        {bio && <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line">{bio}</p>}

        {stats && (
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
            <Stat value={stats.recipes} label={stats.recipes === 1 ? 'receta' : 'recetas'} />
            <Stat value={stats.followers} label={stats.followers === 1 ? 'seguidor' : 'seguidores'} />
            <Stat value={stats.following} label="siguiendo" />
          </div>
        )}
      </div>
    </section>
  );
}
