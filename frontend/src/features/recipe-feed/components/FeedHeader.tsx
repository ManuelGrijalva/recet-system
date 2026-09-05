import React from 'react';

export function FeedHeader(): React.JSX.Element {
  return (
    <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          Recetas de la comunidad
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Explora y comparte la gastronomía tradicional viva de Jutiapa
        </p>
      </div>
      <button
        type="button"
        className="text-xs font-medium px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
      >
        Filtrar
      </button>
    </div>
  );
}
