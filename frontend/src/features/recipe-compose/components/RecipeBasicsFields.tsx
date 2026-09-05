import React from 'react';
import { Input } from '@/shared/components/ui/Input';
import type { Difficulty } from '@/shared/types';
import { DIFFICULTY_OPTIONS } from '../lib/recipeDraft';
import type { RecipeDraft } from '../types';

interface RecipeBasicsFieldsProps {
  draft: RecipeDraft;
  onFieldChange: <K extends keyof RecipeDraft>(
    field: K,
    value: RecipeDraft[K],
  ) => void;
}

export function RecipeBasicsFields({
  draft,
  onFieldChange,
}: RecipeBasicsFieldsProps): React.JSX.Element {
  return (
    <div className="space-y-4 p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a]">
      <Input
        label="Título de la receta"
        value={draft.title}
        onChange={(e) => onFieldChange('title', e.target.value)}
        placeholder="Ejemplo: Marquesote de Jutiapa al comal"
        required
      />

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
          Descripción e historia cultural
        </label>
        <textarea
          value={draft.description}
          onChange={(e) => onFieldChange('description', e.target.value)}
          placeholder="Describe el platillo, su ocasión tradicional de consumo o el contexto en el municipio..."
          rows={3}
          className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] p-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Input
          label="Tiempo de preparación (min)"
          type="number"
          min={1}
          value={draft.timeMinutes}
          onChange={(e) =>
            onFieldChange('timeMinutes', parseInt(e.target.value, 10) || 0)
          }
          required
        />
        <Input
          label="Número de porciones"
          type="number"
          min={1}
          value={draft.servings}
          onChange={(e) =>
            onFieldChange('servings', parseInt(e.target.value, 10) || 0)
          }
          required
        />
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Dificultad
          </label>
          <select
            value={draft.difficulty}
            onChange={(e) =>
              onFieldChange('difficulty', e.target.value as Difficulty)
            }
            className="w-full h-9 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] px-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
          >
            {DIFFICULTY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
