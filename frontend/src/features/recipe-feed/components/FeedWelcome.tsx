import React from 'react';
import Link from 'next/link';
import { TextilePattern } from '@/shared/components/ui/TextilePattern';

// Portada de bienvenida para invitados: explica el proyecto y lleva a buscar o a entrar
export function FeedWelcome(): React.JSX.Element {
  return (
    <section className="relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
      <div className="absolute inset-y-0 right-0 w-1/2 text-zinc-200 dark:text-zinc-800 [mask-image:linear-gradient(to_left,black,transparent)]">
        <TextilePattern />
      </div>
      <div className="relative p-6 sm:p-8 max-w-md">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Jutiapa, Guatemala</p>
        <p className="font-serif text-2xl sm:text-3xl font-semibold leading-tight text-zinc-950 dark:text-zinc-50 mt-1">
          Las recetas de nuestras abuelas, al alcance de tu cocina
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed">
          Un recetario comunitario para rescatar la cocina tradicional de Jutiapa. Dinos qué ingredientes tienes y te
          mostramos qué puedes preparar.
        </p>
        <div className="flex flex-wrap gap-2 mt-5">
          <Link
            href="/search"
            className="text-sm font-medium px-4 py-2 rounded-md bg-brand text-brand-foreground hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 transition-colors"
          >
            Buscar con lo que tengo
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium px-4 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#0a0a0a] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </section>
  );
}
