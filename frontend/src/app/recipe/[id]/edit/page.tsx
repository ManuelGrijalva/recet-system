import type { Metadata } from 'next';
import React from 'react';
import { RecipeComposerScreen } from '@/features/recipe-compose';

export const metadata: Metadata = { title: 'Editar receta' };

interface EditRecipePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRecipePage({
  params,
}: EditRecipePageProps): Promise<React.JSX.Element> {
  const { id } = await params;
  return <RecipeComposerScreen recipeId={id} />;
}
