'use client';

import { useEffect } from 'react';

// Solo en produccion: en desarrollo la cache ocultaria los cambios recien guardados
export function ServiceWorkerRegistrar(): null {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Sin service worker la app sigue funcionando en linea
    });
  }, []);

  return null;
}
