'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchSessionUser, logoutSession } from './sessionApi';
import type { SessionStatus, SessionUser, UserRole } from './types';

interface SessionContextValue {
  user: SessionUser | null;
  status: SessionStatus;
  hasRole: (...roles: UserRole[]) => boolean;
  logout: () => Promise<void>;
  // Relee /auth/me, por ejemplo tras cambiar la foto de perfil
  refresh: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [status, setStatus] = useState<SessionStatus>('loading');

  useEffect(() => {
    let active = true;

    void fetchSessionUser().then((sessionUser) => {
      if (!active) return;
      setUser(sessionUser);
      setStatus(sessionUser ? 'authenticated' : 'guest');
    });

    return () => {
      active = false;
    };
  }, []);

  const hasRole = useCallback(
    (...roles: UserRole[]) => user !== null && roles.includes(user.role),
    [user],
  );

  const logout = useCallback(async () => {
    try {
      await logoutSession();
    } finally {
      // Recarga completa para limpiar el estado de todas las pantallas
      window.location.href = '/';
    }
  }, []);

  const refresh = useCallback(async () => {
    const sessionUser = await fetchSessionUser();
    setUser(sessionUser);
    setStatus(sessionUser ? 'authenticated' : 'guest');
  }, []);

  const value = useMemo(
    () => ({ user, status, hasRole, logout, refresh }),
    [user, status, hasRole, logout, refresh],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession debe usarse dentro de SessionProvider');
  }
  return context;
}
