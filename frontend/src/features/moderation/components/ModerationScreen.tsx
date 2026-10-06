'use client';

import React, { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { PendingRecipesPanel } from './PendingRecipesPanel';
import { UserRoleManager } from './UserRoleManager';

type ModerationTab = 'recipes' | 'users';

const TABS: { id: ModerationTab; label: string }[] = [
  { id: 'recipes', label: 'Recetas pendientes' },
  { id: 'users', label: 'Usuarios' },
];

export function ModerationScreen(): React.JSX.Element {
  const [tab, setTab] = useState<ModerationTab>('recipes');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          Validación de contenido
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Revisa las recetas de la comunidad antes de publicarlas y otorga el rol de colaborador a quien comparte recetas.
        </p>
      </div>

      <div role="tablist" className="flex gap-1 border-b border-zinc-200 dark:border-zinc-800">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              '-mb-px px-3 py-2 text-sm font-medium border-b-2 transition-colors',
              tab === t.id
                ? 'border-zinc-900 dark:border-zinc-100 text-zinc-950 dark:text-zinc-50'
                : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'recipes' ? <PendingRecipesPanel /> : <UserRoleManager />}
    </div>
  );
}
