import React from 'react';
import Link from 'next/link';
import { TextileBand } from '@/shared/components/ui/TextileBand';
import { PhotoCredit } from '@/shared/components/ui/PhotoCredit';
import type { FeedRecipe } from '../types';

interface FeedWelcomeProps {
  // Recetas del feed; las cuatro primeras con foto forman el collage de la portada
  recipes: FeedRecipe[];
}

// Ondas de color de la portada; decorativas, detrás del collage
function HeroWaves(): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 240 110"
      className="pointer-events-none absolute right-0 top-3 hidden h-auto w-64 sm:block"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M240 0 V92 C204 74 172 108 132 82 C104 64 84 30 62 0 Z" className="fill-ochre" />
      <path d="M240 0 V58 C212 44 186 74 152 52 C132 38 120 18 110 0 Z" className="fill-brand" />
    </svg>
  );
}

// Portada de bienvenida para invitados: explica el proyecto, muestra recetas reales y lleva a buscar o a entrar
export function FeedWelcome({ recipes }: FeedWelcomeProps): React.JSX.Element {
  const covers = recipes.filter((recipe) => recipe.coverImageUrl).slice(0, 4);

  return (
    <section className="relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1c1712]">
      <TextileBand scale={0.75} />
      <HeroWaves />

      <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-end sm:p-8">
        <div className="max-w-md flex-1">
          <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Jutiapa, Guatemala</p>
          <p className="font-serif text-2xl sm:text-3xl font-semibold leading-tight text-zinc-950 dark:text-zinc-50 mt-1">
            Las recetas de nuestras abuelas, al alcance de tu cocina
          </p>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-3 leading-relaxed">
            Un recetario comunitario para rescatar la cocina tradicional de Jutiapa. Dinos qué ingredientes tienes y te
            mostramos qué puedes preparar.
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            <Link
              href="/search"
              className="text-sm font-medium px-4 py-2 rounded-md bg-brand text-brand-foreground hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 transition-colors active:scale-[0.97] motion-reduce:active:scale-100"
            >
              Buscar con lo que tengo
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium px-4 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#15110d] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors active:scale-[0.97] motion-reduce:active:scale-100"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>

        {/* Recuadros cuadrados: recortan bien fotos verticales y horizontales por igual */}
        {covers.length > 0 && (
          <div className="grid grid-cols-4 gap-2 sm:w-56 sm:shrink-0 sm:grid-cols-2">
            {covers.map((recipe) => (
              <div
                key={recipe.id}
                className="relative aspect-square overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800"
              >
                <Link href={`/recipe/${recipe.id}`} className="block h-full w-full" aria-label={recipe.title}>
                  <img src={recipe.coverImageUrl ?? ''} alt={recipe.title} loading="lazy" className="h-full w-full object-cover" />
                </Link>
                <PhotoCredit credit={recipe.coverImageCredit} url={recipe.coverImageCreditUrl} className="max-w-[92%]" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
