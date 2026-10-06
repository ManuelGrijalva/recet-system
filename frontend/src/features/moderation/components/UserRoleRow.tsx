import React from 'react';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Button } from '@/shared/components/ui/Button';
import type { ManagedUser, ManagedUserRole } from '../types';

interface UserRoleRowProps {
  user: ManagedUser;
  isUpdating: boolean;
  onSetRole: (role: 'USER' | 'CONTRIBUTOR') => void;
}

const ROLE_LABELS: Record<ManagedUserRole, string> = {
  USER: 'Usuario general',
  CONTRIBUTOR: 'Colaborador',
  ADMIN: 'Administrador',
};

export function UserRoleRow({
  user,
  isUpdating,
  onSetRole,
}: UserRoleRowProps): React.JSX.Element {
  return (
    <li className="flex items-center gap-3 py-3">
      <Avatar src={user.avatarUrl} alt={user.name} fallbackName={user.name} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{user.name}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
          {user.email} · {ROLE_LABELS[user.role]}
        </p>
      </div>

      {user.role === 'USER' && (
        <Button size="sm" variant="primary" isLoading={isUpdating} onClick={() => onSetRole('CONTRIBUTOR')}>
          Hacer colaborador
        </Button>
      )}
      {user.role === 'CONTRIBUTOR' && (
        <Button size="sm" variant="outline" isLoading={isUpdating} onClick={() => onSetRole('USER')}>
          Quitar rol
        </Button>
      )}
    </li>
  );
}
