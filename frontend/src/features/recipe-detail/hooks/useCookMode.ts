'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseCookModeResult {
  // false si el navegador no permite mantener la pantalla encendida
  isSupported: boolean;
  isActive: boolean;
  toggle: () => void;
}

// Modo cocina: mantiene la pantalla encendida mientras se sigue la receta (Screen Wake Lock API)
export function useCookMode(): UseCookModeResult {
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const sentinel = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    setIsSupported('wakeLock' in navigator);
  }, []);

  const release = useCallback(() => {
    void sentinel.current?.release().catch(() => undefined);
    sentinel.current = null;
  }, []);

  const request = useCallback(async () => {
    try {
      sentinel.current = await navigator.wakeLock.request('screen');
      sentinel.current.addEventListener('release', () => {
        sentinel.current = null;
      });
    } catch {
      setIsActive(false);
    }
  }, []);

  useEffect(() => {
    if (!isActive) {
      release();
      return;
    }
    void request();
    // El navegador suelta el bloqueo al cambiar de pestaña; se pide de nuevo al volver
    const onVisible = (): void => {
      if (document.visibilityState === 'visible' && !sentinel.current) void request();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      release();
    };
  }, [isActive, request, release]);

  const toggle = useCallback(() => setIsActive((value) => !value), []);

  return { isSupported, isActive, toggle };
}
