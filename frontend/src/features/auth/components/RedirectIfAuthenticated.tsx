'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/shared/session';

// Quien ya inicio sesion no necesita ver la pantalla de acceso
export function RedirectIfAuthenticated(): null {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') router.replace('/');
  }, [status, router]);

  return null;
}
