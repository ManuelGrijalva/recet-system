'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '../../lib/apiClient';

interface RegionRecipe {
  id: string;
  title: string;
  originRegion: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
}

export function RightSidebar(): React.JSX.Element {
  const [recipes, setRecipes] = useState<RegionRecipe[] | null>(null);

  useEffect(() => {
    let active = true;
    apiClient<RegionRecipe[]>('recipes/search', { params: { region: 'Jutiapa', limit: 6 } })
      .then((data) => {
        if (active) setRecipes(data);
      })
      .catch(() => {
        if (active) setRecipes([]);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <aside className="hidden lg:flex flex-col w-80 h-screen fixed right-0 top-0 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] px-6 py-6 z-40 overflow-y-auto">
      <div className="mb-8 p-4 rounded-md bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
          Sabores de Jutiapa
        </h2>
        {recipes === null ? (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Cargando recetas...</p>
        ) : recipes.length === 0 ? (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Aún no hay recetas de la región.</p>
        ) : (
          <div className="space-y-3">
            {recipes.map((recipe) => (
              <Link key={recipe.id} href={`/recipe/${recipe.id}`} className="block group">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:underline">
                  {recipe.title}
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {recipe.originRegion} · {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 rounded-md border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
        <p className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Patrimonio vivo</p>
        <p className="leading-relaxed">
          El tamal de viaje acompañaba al pueblo xinca en sus jornadas largas: no lleva relleno para conservarse más tiempo.
          Fuente: Sistema de Información Cultural, Ministerio de Cultura y Deportes.
        </p>
      </div>
    </aside>
  );
}
