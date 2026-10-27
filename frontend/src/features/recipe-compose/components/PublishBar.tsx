import React from 'react';
import { Button } from '@/shared/components/ui/Button';
import type { ComposeStatus } from '../types';

interface PublishBarProps {
  isEditing?: boolean;
  status: ComposeStatus;
  isSubmitting: boolean;
  // Mientras sube la foto no se puede enviar
  isBlocked?: boolean;
  onStatusChange: (status: ComposeStatus) => void;
}

export function PublishBar({
  isEditing = false,
  status,
  isSubmitting,
  isBlocked = false,
  onStatusChange,
}: PublishBarProps): React.JSX.Element {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1c1712]">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="draft-toggle"
            checked={status === 'DRAFT'}
            onChange={(e) => onStatusChange(e.target.checked ? 'DRAFT' : 'PUBLISHED')}
            className="rounded-xs border-zinc-300 dark:border-zinc-700 text-zinc-900 focus:ring-0"
          />
          <label htmlFor="draft-toggle" className="text-xs text-zinc-700 dark:text-zinc-300">
            Guardar solo como borrador personal
          </label>
        </div>

        <Button type="submit" size="md" variant="primary" isLoading={isSubmitting} disabled={isBlocked} className="shrink-0 whitespace-nowrap">
          {status === 'DRAFT' ? 'Guardar borrador' : isEditing ? 'Guardar y enviar' : 'Publicar receta'}
        </Button>
      </div>
      {/* Explica por que el boton no responde mientras suben o se ajustan las fotos */}
      {isBlocked && (
        <p role="status" className="text-right text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Espera a que terminen de subir las fotos para publicar.
        </p>
      )}
    </div>
  );
}
