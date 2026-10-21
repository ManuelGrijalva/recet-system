import React from 'react';
import { cn } from '@/shared/lib/utils';
import type { FeedMode } from '../types';

interface FeedHeaderProps {
  mode: FeedMode;
  // Solo con sesion tiene sentido "Siguiendo"
  canFollow: boolean;
  onModeChange: (mode: FeedMode) => void;
}

const MODES: { id: FeedMode; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'following', label: 'Siguiendo' },
];

export function FeedHeader({ mode, canFollow, onModeChange }: FeedHeaderProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          Recetas de la comunidad
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Explora y comparte la gastronomía tradicional viva de Jutiapa
        </p>
      </div>
      {canFollow && (
        <div role="tablist" className="flex shrink-0 rounded-md border border-zinc-200 dark:border-zinc-800 p-0.5">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={mode === m.id}
              onClick={() => onModeChange(m.id)}
              className={cn(
                'text-xs font-medium px-3 py-1 rounded-md transition-colors',
                mode === m.id
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100',
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
