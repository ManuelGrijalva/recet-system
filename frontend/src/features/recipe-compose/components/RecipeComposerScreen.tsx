'use client';

import React from 'react';
import { useRecipeComposer } from '../hooks/useRecipeComposer';
import { RecipeBasicsFields } from './RecipeBasicsFields';
import { IngredientListEditor } from './IngredientListEditor';
import { StepListEditor } from './StepListEditor';
import { PublishBar } from './PublishBar';

export function RecipeComposerScreen(): React.JSX.Element {
  const {
    draft,
    isSubmitting,
    result,
    setField,
    setStatus,
    ingredients,
    steps,
    submit,
  } = useRecipeComposer();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          Publicar receta tradicional
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Comparte las recetas y secretos gastronómicos ancestrales de tu familia y de la región de Jutiapa.
        </p>
      </div>

      {result && (
        <div
          className={`p-4 rounded-md border text-xs font-medium ${
            result.ok
              ? 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100'
              : 'border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200'
          }`}
        >
          {result.message}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
        className="space-y-6"
      >
        <RecipeBasicsFields draft={draft} onFieldChange={setField} />

        <IngredientListEditor
          rows={draft.ingredients}
          onAdd={ingredients.add}
          onRemove={ingredients.remove}
          onUpdate={ingredients.update}
        />

        <StepListEditor
          rows={draft.steps}
          onAdd={steps.add}
          onRemove={steps.remove}
          onUpdate={steps.update}
        />

        <PublishBar
          status={draft.status}
          isSubmitting={isSubmitting}
          onStatusChange={setStatus}
        />
      </form>
    </div>
  );
}
