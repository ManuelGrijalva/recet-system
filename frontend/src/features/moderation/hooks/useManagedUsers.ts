'use client';

import { useCallback, useEffect, useState } from 'react';
import { getManagedUsers } from '../api/getManagedUsers';
import { updateUserRole } from '../api/updateUserRole';
import { describeModerationError } from '../lib/describeModerationError';
import type { ManagedUser } from '../types';

interface UseManagedUsersResult {
  users: ManagedUser[];
  isLoading: boolean;
  error: string | null;
  updatingId: string | null;
  search: (query: string) => void;
  setRole: (userId: string, role: 'USER' | 'CONTRIBUTOR') => Promise<void>;
}

export function useManagedUsers(): UseManagedUsersResult {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    getManagedUsers(query)
      .then((data) => {
        if (active) setUsers(data);
      })
      .catch((err: unknown) => {
        if (active) setError(describeModerationError(err));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [query]);

  const setRole = useCallback(
    async (userId: string, role: 'USER' | 'CONTRIBUTOR'): Promise<void> => {
      setUpdatingId(userId);
      setError(null);

      try {
        const updated = await updateUserRole(userId, role);
        setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
      } catch (err) {
        setError(describeModerationError(err));
      } finally {
        setUpdatingId(null);
      }
    },
    [],
  );

  return { users, isLoading, error, updatingId, search: setQuery, setRole };
}
