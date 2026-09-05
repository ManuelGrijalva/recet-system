import React from 'react';
import { Avatar } from '../shared/components/ui/Avatar';

interface SampleRecipe {
  id: string;
  title: string;
  author: {
    name: string;
    avatarUrl?: string;
    role: string;
  };
  region: string;
  timeMinutes: number;
  servings: number;
  difficulty: 'Fácil' | 'Media' | 'Difícil';
  description: string;
  coverImage?: string;
  ingredientsCount: number;
  stats: {
    likes: number;
    yummy: number;
    triedIt: number;
    comments: number;
  };
}

const sampleRecipes: SampleRecipe[] = [
  {
    id: '1',
    title: 'Quesadilla de Arroz Tradicional de Jutiapa',
    author: {
      name: 'Doña Rosalía Gómez',
      role: 'Cocinera tradicional',
    },
    region: 'Jutiapa, Jutiapa',
    timeMinutes: 60,
    servings: 12,
    difficulty: 'Media',
    description:
      'Auténtica quesadilla jutiapaneca elaborada con harina de arroz, queso fresco artesanal, crema criolla y horneada a fuego constante.',
    ingredientsCount: 6,
    stats: {
      likes: 42,
      yummy: 68,
      triedIt: 19,
      comments: 14,
    },
  },
  {
    id: '2',
    title: 'Gallo en Chicha al Estilo de Oriente',
    author: {
      name: 'Carlos Menéndez',
      role: 'Custodio del sabor',
    },
    region: 'Asunción Mita, Jutiapa',
    timeMinutes: 90,
    servings: 8,
    difficulty: 'Difícil',
    description:
      'Gallo de patio marinado en chicha tradicional con panela, pimienta gorda, clavo y canela. Un manjar festivo de la cultura de Oriente.',
    ingredientsCount: 11,
    stats: {
      likes: 35,
      yummy: 54,
      triedIt: 12,
      comments: 8,
    },
  },
];

export default function HomePage(): React.JSX.Element {
  return (
    <div className="space-y-6">
      {/* Encabezado del Feed */}
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

      {/* Lista de Recetas del Feed */}
      <div className="space-y-6">
        {sampleRecipes.map((recipe) => (
          <article
            key={recipe.id}
            className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] overflow-hidden"
          >
            {/* Cabecera del Post */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar alt={recipe.author.name} fallbackName={recipe.author.name} size="md" />
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                    {recipe.author.name}
                  </h3>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    {recipe.region} · {recipe.author.role}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                aria-label="Opciones de receta"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
            </div>

            {/* Contenido Principal */}
            <div className="px-4 pb-3">
              <h2 className="text-base font-bold text-zinc-950 dark:text-zinc-50 mb-1.5">
                {recipe.title}
              </h2>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-3">
                {recipe.description}
              </p>

              {/* Metadatos de la Receta */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                <span className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  {recipe.timeMinutes} minutos
                </span>
                <span className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  {recipe.servings} porciones
                </span>
                <span className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  Dificultad: {recipe.difficulty}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  {recipe.ingredientsCount} ingredientes
                </span>
              </div>
            </div>

            {/* Barra de Interacciones (Reacciones + Guardado + Comentarios + Compartir) */}
            <div className="px-4 py-3 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
              {/* Grupo de Reacciones Optimistas */}
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span>Me gusta ({recipe.stats.likes})</span>
                </button>

                <button
                  type="button"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Delicioso ({recipe.stats.yummy})</span>
                </button>

                <button
                  type="button"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>La preparé ({recipe.stats.triedIt})</span>
                </button>
              </div>

              {/* Guardar y Compartir */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="p-2 rounded-md text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                  aria-label="Guardar en recetario"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="p-2 rounded-md text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                  aria-label="Compartir receta"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
