import React from 'react';
import Link from 'next/link';

interface SavedRecipeItem {
  id: string;
  title: string;
  author: string;
  region: string;
  timeMinutes: number;
  savedDate: string;
}

const savedRecipesMock: SavedRecipeItem[] = [
  {
    id: '1',
    title: 'Quesadilla de Arroz Tradicional de Jutiapa',
    author: 'Doña Rosalía Gómez',
    region: 'Jutiapa',
    timeMinutes: 60,
    savedDate: 'Guardado el 2 de septiembre',
  },
  {
    id: '2',
    title: 'Gallo en Chicha al Estilo de Oriente',
    author: 'Carlos Menéndez',
    region: 'Asunción Mita',
    timeMinutes: 90,
    savedDate: 'Guardado el 28 de agosto',
  },
];

export default function SavedRecipesPage(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          Recetario guardado
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Tu colección privada de preparaciones tradicionales guardadas para cocinar cuando quieras.
        </p>
      </div>

      <div className="space-y-3">
        {savedRecipesMock.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] flex items-center justify-between"
          >
            <div>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {item.region} · Por {item.author}
              </span>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {item.title}
              </h2>
              <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                <span>{item.timeMinutes} minutos</span>
                <span>•</span>
                <span>{item.savedDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/recipe/${item.id}`}
                className="text-xs font-medium px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                Ver receta
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
