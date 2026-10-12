'use client';

import React from 'react';
import { Button } from '@/shared/components/ui/Button';

export function OfflineScreen(): React.JSX.Element {
  return (
    <div className="rounded-md border border-dashed border-zinc-200 dark:border-zinc-800 p-8 text-center space-y-3">
      <h1 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">Sin conexión</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Esta página todavía no se ha abierto en este dispositivo. Las recetas que ya visitaste siguen disponibles sin internet.
      </p>
      <Button variant="outline" size="md" onClick={() => window.location.reload()}>
        Reintentar
      </Button>
    </div>
  );
}
