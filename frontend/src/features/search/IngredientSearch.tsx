'use client';

import React, { useState } from 'react';
import { Button } from '../../shared/components/ui/Button';
import { cn } from '../../shared/lib/utils';
import Link from 'next/link';

const commonJutiapaIngredients = [
  'Harina de arroz',
  'Queso artesanal',
  'Crema fresca de vaca',
  'Panela / Chancaca',
  'Canela en raja',
  'Gallina criolla',
  'Almidón de yuca',
  'Pimienta gorda',
  'Ajonjolí tostado',
  'Manteca de cerdo',
  'Huevos de patio',
  'Clavos de olor',
];

interface MatchedRecipe {
  id: string;
  title: string;
  region: string;
  matchPercentage: number;
  matchedIngredients: string[];
  missingIngredients: string[];
}

const mockCatalog: {
  id: string;
  title: string;
  region: string;
  required: string[];
}[] = [
  {
    id: '1',
    title: 'Quesadilla de Arroz de Jutiapa',
    region: 'Jutiapa',
    required: ['Harina de arroz', 'Queso artesanal', 'Crema fresca de vaca', 'Huevos de patio', 'Ajonjolí tostado'],
  },
  {
    id: '2',
    title: 'Salpores de Almidón Tradicionales',
    region: 'Jutiapa',
    required: ['Almidón de yuca', 'Manteca de cerdo', 'Panela / Chancaca', 'Canela en raja'],
  },
  {
    id: '3',
    title: 'Gallo en Chicha al Estilo de Oriente',
    region: 'Asunción Mita',
    required: ['Gallina criolla', 'Panela / Chancaca', 'Pimienta gorda', 'Clavos de olor', 'Canela en raja'],
  },
];

export function IngredientSearch(): React.JSX.Element {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([
    'Harina de arroz',
    'Crema fresca de vaca',
  ]);
  const [customInput, setCustomInput] = useState('');

  const toggleIngredient = (name: string) => {
    if (selectedIngredients.includes(name)) {
      setSelectedIngredients(selectedIngredients.filter((i) => i !== name));
    } else {
      setSelectedIngredients([...selectedIngredients, name]);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const clean = customInput.trim();
    if (!selectedIngredients.includes(clean)) {
      setSelectedIngredients([...selectedIngredients, clean]);
    }
    setCustomInput('');
  };

  // Algoritmo de coincidencia (numeral 3.4.2 de Entrega I part2.md)
  const results: MatchedRecipe[] = mockCatalog
    .map((recipe) => {
      const matched = recipe.required.filter((ing) =>
        selectedIngredients.some((sel) => sel.toLowerCase() === ing.toLowerCase()),
      );
      const missing = recipe.required.filter(
        (ing) => !selectedIngredients.some((sel) => sel.toLowerCase() === ing.toLowerCase()),
      );
      const pct = Math.round((matched.length / recipe.required.length) * 100);

      return {
        id: recipe.id,
        title: recipe.title,
        region: recipe.region,
        matchPercentage: pct,
        matchedIngredients: matched,
        missingIngredients: missing,
      };
    })
    .filter((r) => r.matchPercentage > 0)
    .sort((a, b) => b.matchPercentage - a.matchPercentage); // Ordenado por coincidencia descendente

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          Búsqueda inteligente por ingredientes
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Selecciona los ingredientes que tienes en tu cocina para saber qué recetas tradicionales puedes preparar de inmediato.
        </p>
      </div>

      {/* Formulario de agregar insumo propio */}
      <form onSubmit={handleAddCustom} className="flex gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="Escribe otro ingrediente..."
          className="flex-1 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
        />
        <Button type="submit" size="sm" variant="secondary" disabled={!customInput.trim()}>
          Agregar
        </Button>
      </form>

      {/* Lista de ingredientes comunes de Jutiapa */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Ingredientes tradicionales comunes
        </p>
        <div className="flex flex-wrap gap-2">
          {commonJutiapaIngredients.map((ingredient) => {
            const isSelected = selectedIngredients.includes(ingredient);
            return (
              <button
                key={ingredient}
                type="button"
                onClick={() => toggleIngredient(ingredient)}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-md font-medium border transition-colors',
                  isSelected
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900',
                )}
              >
                {isSelected ? '✓ ' : '+ '}
                {ingredient}
              </button>
            );
          })}
        </div>
      </div>

      {/* Resultados clasificados por coincidencia */}
      <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            Recetas sugeridas ({results.length})
          </h2>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Ordenadas por coincidencia
          </span>
        </div>

        {results.length === 0 ? (
          <div className="rounded-md border border-dashed border-zinc-200 dark:border-zinc-800 p-8 text-center">
            <p className="text-xs text-zinc-500">
              No encontramos recetas que coincidan con los ingredientes seleccionados. Prueba agregando otros insumos.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((recipe) => (
              <div
                key={recipe.id}
                className="p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {recipe.region}
                    </span>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {recipe.title}
                    </h3>
                  </div>
                  {/* Badge de Porcentaje de Coincidencia */}
                  <div className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    {recipe.matchPercentage}% disponible
                  </div>
                </div>

                <div className="mt-3 space-y-1.5 text-xs">
                  <p className="text-zinc-600 dark:text-zinc-400">
                    <span className="font-medium text-zinc-900 dark:text-zinc-200">
                      Tienes ({recipe.matchedIngredients.length}):
                    </span>{' '}
                    {recipe.matchedIngredients.join(', ')}
                  </p>
                  {recipe.missingIngredients.length > 0 && (
                    <p className="text-zinc-500 dark:text-zinc-400">
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">
                        Te falta ({recipe.missingIngredients.length}):
                      </span>{' '}
                      {recipe.missingIngredients.join(', ')}
                    </p>
                  )}
                </div>

                <div className="mt-3 flex justify-end">
                  <Link
                    href={`/recipe/${recipe.id}`}
                    className="text-xs font-medium px-3 py-1.5 rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                  >
                    Ver preparación
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
