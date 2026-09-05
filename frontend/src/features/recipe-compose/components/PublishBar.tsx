import React from 'react';
import { Button } from '@/shared/components/ui/Button';
import type { ComposeStatus } from '../types';

interface PublishBarProps {
  status: ComposeStatus;
  isSubmitting: boolean;
  onStatusChange: (status: ComposeStatus) => void;
}

export function PublishBar({
  status,
  isSubmitting,
  onStatusChange,
}: PublishBarProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a]">
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

      <Button type="submit" size="md" variant="primary" isLoading={isSubmitting}>
        {status === 'PUBLISHED' ? 'Publicar receta' : 'Guardar borrador'}
      </Button>
    </div>
  );
}
