import React from 'react';
import Link from 'next/link';
import { Avatar } from '../ui/Avatar';

interface ChefSuggestion {
  id: string;
  name: string;
  specialty: string;
  avatarUrl?: string;
}

interface CulinaryTrend {
  id: string;
  name: string;
  tag: string;
  recipeCount: number;
}

const suggestedChefs: ChefSuggestion[] = [
  {
    id: '1',
    name: 'Doña Rosalía Gómez',
    specialty: 'Quesadillas y Salpores de Jutiapa',
  },
  {
    id: '2',
    name: 'Carlos Menéndez',
    specialty: 'Gallo en Chicha y Caldos Orientales',
  },
  {
    id: '3',
    name: 'Elena Arana',
    specialty: 'Pan dulce tradicional de comal',
  },
];

const traditionalTrends: CulinaryTrend[] = [
  {
    id: '1',
    name: 'Quesadilla de Arroz de Jutiapa',
    tag: '#TradiciónJutiapaneca',
    recipeCount: 38,
  },
  {
    id: '2',
    name: 'Gallo en Chicha Tradicional',
    tag: '#CocinaDeOriente',
    recipeCount: 24,
  },
  {
    id: '3',
    name: 'Marquesote Casero',
    tag: '#ReposteríaAncestral',
    recipeCount: 19,
  },
  {
    id: '4',
    name: 'Salpores de Almidón',
    tag: '#SaboresDeAntaño',
    recipeCount: 15,
  },
];

export function RightSidebar(): React.JSX.Element {
  return (
    <aside className="hidden lg:flex flex-col w-80 h-screen fixed right-0 top-0 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] px-6 py-6 z-40 overflow-y-auto">
      {/* Sugerencias de cocineros de la comunidad */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Cocineros recomendados
          </h2>
          <Link
            href="/explore/chefs"
            className="text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            Ver todos
          </Link>
        </div>
        <div className="space-y-3.5">
          {suggestedChefs.map((chef) => (
            <div key={chef.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar alt={chef.name} fallbackName={chef.name} size="md" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    {chef.name}
                  </p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                    {chef.specialty}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Seguir
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tendencias Culinarias de Jutiapa */}
      <div className="mb-8 p-4 rounded-md bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
          Tendencias en Jutiapa
        </h2>
        <div className="space-y-3">
          {traditionalTrends.map((trend) => (
            <Link
              key={trend.id}
              href={`/search?q=${encodeURIComponent(trend.name)}`}
              className="block group"
            >
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {trend.tag}
              </p>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:underline">
                {trend.name}
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {trend.recipeCount} recetas comunitarias
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Consejo Cultural Gastronómico */}
      <div className="p-4 rounded-md border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
        <p className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
          Patrimonio vivo
        </p>
        <p className="leading-relaxed">
          La quesadilla tradicional de Jutiapa utiliza queso criollo y crema fresca de vaca elaborados en la región de Oriente, horneada en molde de lata.
        </p>
      </div>

      {/* Footer / Copyright */}
      <div className="mt-auto pt-6 text-[11px] text-zinc-400 dark:text-zinc-600 space-y-1">
        <p>© 2026 Recetario Tradicional de Jutiapa</p>
        <p>Proyecto de Graduación l · UMG Campus Jutiapa</p>
      </div>
    </aside>
  );
}
