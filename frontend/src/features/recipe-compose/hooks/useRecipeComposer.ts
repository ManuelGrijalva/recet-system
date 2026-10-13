'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiError } from '@/shared/lib/apiClient';
import type { RecipeStatus } from '@/shared/types';
import { createRecipe } from '../api/createRecipe';
import { getEditableRecipe } from '../api/getEditableRecipe';
import { updateRecipe } from '../api/updateRecipe';
import { buildCreateRecipePayload } from '../lib/buildCreateRecipePayload';
import {
  addIngredient,
  addStep,
  createEmptyDraft,
  draftFromRecipe,
  removeIngredientAt,
  removeStepAt,
  updateIngredientAt,
  updateStepAt,
} from '../lib/recipeDraft';
import type {
  ComposeStatus,
  IngredientDraft,
  RecipeDraft,
} from '../types';

const SUCCESS_MESSAGES: Record<RecipeStatus, string> = {
  PENDING_REVIEW:
    'Tu receta quedó pendiente de revisión. Aparecerá en el feed cuando un administrador la apruebe.',
  PUBLISHED: 'Tu receta fue publicada.',
  DRAFT: 'Borrador guardado exitosamente.',
  ARCHIVED: 'La receta quedó archivada.',
};

function describeSubmitError(err: unknown, isEditing: boolean): string {
  if (err instanceof ApiError && err.status === 401) {
    return 'Inicia sesión para publicar recetas.';
  }
  if (err instanceof ApiError && err.status === 403 && !isEditing) {
    return 'Solo los usuarios colaboradores pueden publicar recetas. Solicita el rol a un administrador.';
  }
  return err instanceof Error
    ? err.message
    : 'No se pudo guardar la receta. Intenta de nuevo.';
}

interface SubmitResult {
  ok: boolean;
  message: string;
}

interface UseRecipeComposerResult {
  draft: RecipeDraft;
  isEditing: boolean;
  isLoadingRecipe: boolean;
  loadError: string | null;
  reviewNotes: string | null;
  isSubmitting: boolean;
  result: SubmitResult | null;
  setField: <K extends keyof RecipeDraft>(field: K, value: RecipeDraft[K]) => void;
  setStatus: (status: ComposeStatus) => void;
  ingredients: {
    add: () => void;
    remove: (index: number) => void;
    update: (index: number, field: keyof IngredientDraft, value: string) => void;
  };
  steps: {
    add: () => void;
    remove: (index: number) => void;
    update: (index: number, instruction: string) => void;
  };
  submit: () => Promise<void>;
}

export function useRecipeComposer(recipeId?: string): UseRecipeComposerResult {
  const [draft, setDraft] = useState<RecipeDraft>(createEmptyDraft);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(recipeId !== undefined);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<string | null>(null);

  useEffect(() => {
    if (!recipeId) return;
    let active = true;

    getEditableRecipe(recipeId)
      .then((recipe) => {
        if (!active) return;
        setDraft(draftFromRecipe(recipe));
        setReviewNotes(recipe.reviewNotes ?? null);
      })
      .catch(() => {
        if (active) setLoadError('No se pudo cargar la receta para editarla.');
      })
      .finally(() => {
        if (active) setIsLoadingRecipe(false);
      });

    return () => {
      active = false;
    };
  }, [recipeId]);

  const setField = useCallback(
    <K extends keyof RecipeDraft>(field: K, value: RecipeDraft[K]) => {
      setDraft((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const setStatus = useCallback((status: ComposeStatus) => {
    setDraft((prev) => ({ ...prev, status }));
  }, []);

  const ingredients = useMemo(
    () => ({
      add: () =>
        setDraft((prev) => ({
          ...prev,
          ingredients: addIngredient(prev.ingredients),
        })),
      remove: (index: number) =>
        setDraft((prev) => ({
          ...prev,
          ingredients: removeIngredientAt(prev.ingredients, index),
        })),
      update: (index: number, field: keyof IngredientDraft, value: string) =>
        setDraft((prev) => ({
          ...prev,
          ingredients: updateIngredientAt(prev.ingredients, index, field, value),
        })),
    }),
    [],
  );

  const steps = useMemo(
    () => ({
      add: () => setDraft((prev) => ({ ...prev, steps: addStep(prev.steps) })),
      remove: (index: number) =>
        setDraft((prev) => ({ ...prev, steps: removeStepAt(prev.steps, index) })),
      update: (index: number, instruction: string) =>
        setDraft((prev) => ({
          ...prev,
          steps: updateStepAt(prev.steps, index, instruction),
        })),
    }),
    [],
  );

  const submit = useCallback(async () => {
    setIsSubmitting(true);
    setResult(null);

    try {
      const payload = buildCreateRecipePayload(draft);
      const created = recipeId
        ? await updateRecipe(recipeId, payload)
        : await createRecipe(payload);
      setResult({ ok: true, message: SUCCESS_MESSAGES[created.status] });
    } catch (err) {
      setResult({ ok: false, message: describeSubmitError(err, recipeId !== undefined) });
    } finally {
      setIsSubmitting(false);
    }
  }, [draft, recipeId]);

  return {
    draft,
    isEditing: recipeId !== undefined,
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
  };
}
