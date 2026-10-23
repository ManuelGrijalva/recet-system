'use client';

import React, { useCallback } from 'react';
import { useRecipeComposer } from '../hooks/useRecipeComposer';
import { useRecipePhotos } from '../hooks/useRecipePhotos';
import { moveToFront, removeAt } from '../lib/recipePhotos';
import { RecipePhotosField } from './RecipePhotosField';
import { PhotoCropModal } from './PhotoCropModal';
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
    updateImages,
    ingredients,
    steps,
    submit,
  } = useRecipeComposer(recipeId);
  const appendImage = useCallback((url: string) => updateImages((prev) => [...prev, url]), [updateImages]);
  const photos = useRecipePhotos(draft.images.length, appendImage);

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

        <RecipePhotosField
          images={draft.images}
          uploadingCount={photos.uploadingCount}
          error={photos.error}
          onSelectFiles={photos.addFiles}
          onMakeCover={(index) => updateImages((prev) => moveToFront(prev, index))}
          onRemove={(index) => updateImages((prev) => removeAt(prev, index))}
        />

        {photos.pendingFile && (
          <PhotoCropModal
            key={`${photos.pendingFile.name}-${photos.pendingFile.lastModified}-${photos.queuedCount}`}
            file={photos.pendingFile}
            remaining={photos.queuedCount - 1}
            onConfirm={photos.confirmCrop}
            onSkip={photos.skipPending}
          />
        )}

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
          isBlocked={photos.uploadingCount > 0 || photos.pendingFile !== null}
          onStatusChange={setStatus}
        />
      </form>
    </div>
  );
}
