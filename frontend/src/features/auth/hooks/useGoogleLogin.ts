'use client';

import { useCallback, useState } from 'react';
import { googleLoginUrl } from '../api/authEndpoints';

interface UseGoogleLoginResult {
  isRedirecting: boolean;
  login: () => void;
}

/**
 * Inicia el login con Google redirigiendo el navegador al endpoint OAuth del
 * backend. El backend fija la cookie JWT y vuelve al frontend.
 */
export function useGoogleLogin(): UseGoogleLoginResult {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const login = useCallback(() => {
    setIsRedirecting(true);
    window.location.href = googleLoginUrl();
  }, []);

  return { isRedirecting, login };
}
