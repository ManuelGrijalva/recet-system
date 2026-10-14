'use client';

import React, { useCallback } from 'react';
import { useRecipeComposer } from '../hooks/useRecipeComposer';
import { useCoverImageUpload } from '../hooks/useCoverImageUpload';
import { CoverImageField } from './CoverImageField';
import { RecipeBasicsFields } from './RecipeBasicsFields';
import { IngredientListEditor } from './IngredientListEditor';
import { StepListEditor } from './StepListEditor';
import { PublishBar } from './PublishBar';

interface RecipeComposerScreenProps {
  recipeId?: string;
}

export function RecipeComposerScreen({ recipeId }: RecipeComposerScreenProps): React.JSX.Element {
  const {
    draft,
    isEditing,
    isLoadingRecipe,
    loadError,
    reviewNotes,
    isSubmitting,
    result,
    setField,
    setStatus,
    ingredients,
    steps,
    submit,
  } = useRecipeComposer(recipeId);
  const setCoverImage = useCallback((url: string) => setField('coverImageUrl', url), [setField]);
  const cover = useCoverImageUpload(setCoverImage);

  if (isLoadingRecipe) {
    return <p className="text-xs text-zinc-500 dark:text-zinc-400">Cargando receta...</p>;
  }

  if (loadError) {
    return <p className="text-xs text-zinc-700 dark:text-zinc-300">{loadError}</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          {isEditing ? 'Editar receta' : 'Publicar receta tradicional'}
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          {isEditing
            ? 'Al guardar, la receta vuelve a revisión del administrador antes de mostrarse en el feed.'
            : 'Comparte las recetas y secretos gastronómicos ancestrales de tu familia y de la región de Jutiapa.'}
        </p>
      </div>

      {reviewNotes && (
        <div className="p-4 rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 space-y-1">
          <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100">Observaciones del administrador</p>
          <p className="text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-line">{reviewNotes}</p>
        </div>
      )}

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

        <CoverImageField
          imageUrl={draft.coverImageUrl}
          isUploading={cover.isUploading}
          error={cover.error}
          onSelectFile={(file) => void cover.upload(file)}
          onRemove={() => setField('coverImageUrl', null)}
        />

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
          isEditing={isEditing}
          status={draft.status}
          isSubmitting={isSubmitting}
          isBlocked={cover.isUploading}
          onStatusChange={setStatus}
        />
      </form>
    </div>
  );
}
