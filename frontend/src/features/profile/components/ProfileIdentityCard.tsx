import React from 'react';
import { Avatar } from '@/shared/components/ui/Avatar';
import type { UserProfile } from '../types';

interface ProfileIdentityCardProps {
  profile: UserProfile;
}

const ROLE_LABELS: Record<UserProfile['role'], string> = {
  USER: 'Miembro de la comunidad',
  CONTRIBUTOR: 'Investigador / Colaborador Jutiapa',
  ADMIN: 'Administrador',
};

export function ProfileIdentityCard({
  profile,
}: ProfileIdentityCardProps): React.JSX.Element {
  return (
    <div className="p-5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] flex items-center gap-4">
      <Avatar
        src={profile.avatarUrl}
        alt={profile.name}
        fallbackName={profile.name}
        size="lg"
      />
      <div>
        <h2 className="text-base font-bold text-zinc-950 dark:text-zinc-50">
          {profile.name}
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {profile.email} · {ROLE_LABELS[profile.role]}
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
            Autenticado con Google
          </span>
        </div>
      </div>
    </div>
  );
}
