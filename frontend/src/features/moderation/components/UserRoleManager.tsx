'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { useManagedUsers } from '../hooks/useManagedUsers';
import { UserRoleRow } from './UserRoleRow';

export function UserRoleManager(): React.JSX.Element {
  const { users, isLoading, error, updatingId, search, setRole } = useManagedUsers();
  const [term, setTerm] = useState('');

  return (
    <div className="space-y-4">
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          search(term);
        }}
      >
        <Input
          aria-label="Buscar usuarios"
          placeholder="Buscar por nombre o correo"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <Button type="submit" variant="secondary" size="md">
          Buscar
        </Button>
      </form>

      {error && (
        <div className="p-4 rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-xs font-medium text-zinc-800 dark:text-zinc-200">
          {error}
        </div>
      )}

      {isLoading ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Cargando usuarios...</p>
      ) : users.length === 0 ? (
        !error && (
          <div className="rounded-md border border-dashed border-zinc-200 dark:border-zinc-800 p-8 text-center">
            <p className="text-xs text-zinc-500">No se encontraron usuarios.</p>
          </div>
        )
      ) : (
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800 px-4">
          {users.map((user) => (
            <UserRoleRow
              key={user.id}
              user={user}
              isUpdating={updatingId === user.id}
              onSetRole={(role) => void setRole(user.id, role)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
