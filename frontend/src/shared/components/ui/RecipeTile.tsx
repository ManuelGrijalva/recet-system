import React from 'react';
import Link from 'next/link';
import { PhotoCredit } from './PhotoCredit';
import { RecipeCoverPlaceholder } from './RecipeCoverPlaceholder';

interface RecipeTileProps {
  id: string;
  title: string;
  coverImageUrl?: string | null;
  coverImageCredit?: string | null;
  coverImageCreditUrl?: string | null;
  // Linea secundaria: tiempo, autor o fecha en que se guardo
  meta?: string;
  index?: number;
}

// Recuadro de receta para cuadriculas (perfil y recetario): foto cuadrada con su credito y el titulo debajo
export function RecipeTile({
  id,
  title,
  coverImageUrl,
  coverImageCredit,
  coverImageCreditUrl,
  meta,
  index = 0,
}: RecipeTileProps): React.JSX.Element {
  return (
    <li
      className="animate-rise-in overflow-hidden rounded-md border border-zinc-200 bg-white transition-[border-color,box-shadow] duration-200 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-[#1c1712]"
      style={{ animationDelay: `${Math.min(index, 5) * 40}ms` }}
    >
      <div className="relative">
        <Link href={`/recipe/${id}`} className="block" tabIndex={-1} aria-hidden="true">
          {coverImageUrl ? (
            <img src={coverImageUrl} alt="" loading="lazy" className="aspect-square w-full object-cover" />
          ) : (
            <RecipeCoverPlaceholder title={title} className="aspect-square w-full" />
          )}
        </Link>
        {coverImageUrl && <PhotoCredit credit={coverImageCredit} url={coverImageCreditUrl} className="max-w-[92%]" />}
      </div>
      <Link
        href={`/recipe/${id}`}
        className="block p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
      >
        <span className="line-clamp-2 font-serif text-sm font-semibold leading-snug text-zinc-900 dark:text-zinc-100">{title}</span>
        {meta && <span className="mt-0.5 block truncate text-xs text-zinc-500 dark:text-zinc-400">{meta}</span>}
      </Link>
    </li>
  );
}

// Cuadricula de 2 columnas en el celular y 3 desde tableta
export function RecipeTileGrid({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">{children}</ul>;
}
