'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/components/ui/Button';
import { deleteRecipe } from '@/features/my-recipes';

interface AdminDeleteRecipeButtonProps {
  recipeId: string;
}

// Moderación posterior: el admin retira recetas que no cumplen las normas de contenido
export function AdminDeleteRecipeButton({ recipeId }: AdminDeleteRecipeButtonProps): React.JSX.Element {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async (): Promise<void> => {
    setIsDeleting(true);
    setError(null);
    try {
      await deleteRecipe(recipeId);
      router.replace('/');
    } catch {
      setError('No se pudo eliminar la receta.');
      setIsDeleting(false);
    }
  };

  if (!confirming) {
    return (
      <Button size="sm" variant="outline" onClick={() => setConfirming(true)}>
        Eliminar receta
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-zinc-600 dark:text-zinc-400">{error ?? '¿Eliminar para siempre?'}</span>
      <Button size="sm" variant="ghost" onClick={() => setConfirming(false)} disabled={isDeleting}>
        Cancelar
      </Button>
      <Button size="sm" variant="primary" onClick={() => void remove()} isLoading={isDeleting}>
        Eliminar
      </Button>
    </div>
  );
}
