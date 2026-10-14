'use client';

import React, { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { PendingRecipesPanel } from './PendingRecipesPanel';
import { UserRoleManager } from './UserRoleManager';
import { PublishedRecipesPanel } from './PublishedRecipesPanel';
import { ContributorRequestsPanel } from './ContributorRequestsPanel';

type ModerationTab = 'recipes' | 'published' | 'requests' | 'users';

const TABS: { id: ModerationTab; label: string }[] = [
  { id: 'recipes', label: 'Recetas pendientes' },
  { id: 'published', label: 'Publicadas' },
  { id: 'requests', label: 'Solicitudes' },
  { id: 'users', label: 'Usuarios' },
];

const PANELS: Record<ModerationTab, () => React.JSX.Element> = {
  recipes: PendingRecipesPanel,
  published: PublishedRecipesPanel,
  requests: ContributorRequestsPanel,
  users: UserRoleManager,
};

export function ModerationScreen(): React.JSX.Element {
  const [tab, setTab] = useState<ModerationTab>('recipes');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          Validación de contenido
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Revisa las recetas antes de publicarlas, elimina las que no cumplan las normas y atiende las solicitudes para ser colaborador.
        </p>
      </div>

      <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-zinc-200 dark:border-zinc-800">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              '-mb-px shrink-0 px-3 py-2 text-sm font-medium border-b-2 transition-colors',
              tab === t.id
                ? 'border-zinc-900 dark:border-zinc-100 text-zinc-950 dark:text-zinc-50'
                : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {React.createElement(PANELS[tab])}
    </div>
  );
}
