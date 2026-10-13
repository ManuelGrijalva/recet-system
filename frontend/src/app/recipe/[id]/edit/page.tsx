import React from 'react';
import { RecipeComposerScreen } from '@/features/recipe-compose';

interface EditRecipePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRecipePage({
  params,
}: EditRecipePageProps): Promise<React.JSX.Element> {
  const { id } = await params;
  return <RecipeComposerScreen recipeId={id} />;
}
