'use client';

import React, { useCallback } from 'react';
import { Notice } from '@/shared/components/ui/Notice';
import { useRecipeComposer } from '../hooks/useRecipeComposer';
import { useRecipePhotos } from '../hooks/useRecipePhotos';
import { MAX_RECIPE_PHOTOS, moveToFront, removeAt } from '../lib/recipePhotos';
import { RecipePhotosField } from './RecipePhotosField';
import { PhotoCropModal } from './PhotoCropModal';
import { RecipeBasicsFields } from './RecipeBasicsFields';
import { IngredientListEditor } from './IngredientListEditor';
import { StepListEditor } from './StepListEditor';
import { PublishBar } from './PublishBar';
import { TextileBand } from '@/shared/components/ui/TextileBand';
import { SkeletonList } from '@/shared/components/ui/Skeleton';
import { ComposeSection } from './ComposeSection';
import { RecipeDraftPreview } from './RecipeDraftPreview';

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
  // Avance de cada seccion: el numero se vuelve una marca de verificacion al completarla
  const basicsDone = draft.title.trim() !== '' && draft.description.trim() !== '' && draft.originRegion.trim() !== '';
  const ingredientsDone = draft.ingredients.some((row) => row.name.trim() !== '');
  const stepsDone = draft.steps.some((row) => row.instruction.trim() !== '');

  if (isLoadingRecipe) {
    return <SkeletonList rows={4} label="Cargando receta" />;
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
        <TextileBand scale={0.375} className="mt-3 rounded-sm" />
      </div>

      {reviewNotes && (
        <Notice tone="danger">
          <p className="font-semibold">Observaciones del administrador</p>
          <p className="whitespace-pre-line">{reviewNotes}</p>
        </Notice>
      )}

      {result && (
        <Notice tone={result.ok ? 'success' : 'danger'} role="status" className="font-medium">
          {result.message}
        </Notice>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
        className="space-y-6"
      >
        <ComposeSection number={1} title="Datos de la receta" hint="Nombre, historia, municipio, tiempos y dificultad." done={basicsDone}>
          <RecipeBasicsFields draft={draft} onFieldChange={setField} />
        </ComposeSection>

        <ComposeSection
          number={2}
          title="Fotos del platillo"
          hint={`Hasta ${MAX_RECIPE_PHOTOS}. Ajustas el encuadre de cada una antes de subirla; la primera es la portada.`}
          done={draft.images.length > 0}
          optional
        >
          <RecipePhotosField
            images={draft.images}
            uploadingCount={photos.uploadingCount}
            error={photos.error}
            onSelectFiles={photos.addFiles}
            onMakeCover={(index) => updateImages((prev) => moveToFront(prev, index))}
            onRemove={(index) => updateImages((prev) => removeAt(prev, index))}
          />
        </ComposeSection>

        {photos.pendingFile && (
          <PhotoCropModal
            key={`${photos.pendingFile.name}-${photos.pendingFile.lastModified}-${photos.queuedCount}`}
            file={photos.pendingFile}
            remaining={photos.queuedCount - 1}
            onConfirm={photos.confirmCrop}
            onSkip={photos.skipPending}
          />
        )}

        <ComposeSection number={3} title="Ingredientes" hint="Escribe cada ingrediente con su cantidad y unidad." done={ingredientsDone}>
          <IngredientListEditor
            rows={draft.ingredients}
            onAdd={ingredients.add}
            onRemove={ingredients.remove}
            onUpdate={ingredients.update}
          />
        </ComposeSection>

        <ComposeSection number={4} title="Pasos de preparación" hint="Un paso por recuadro, en el orden en que se hacen." done={stepsDone}>
          <StepListEditor
            rows={draft.steps}
            onAdd={steps.add}
            onRemove={steps.remove}
            onUpdate={steps.update}
          />
        </ComposeSection>

        <ComposeSection number={5} title="Vista previa" hint="Así se verá tu receta en el inicio de la comunidad." done={basicsDone && ingredientsDone && stepsDone}>
          <RecipeDraftPreview draft={draft} />
        </ComposeSection>

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
