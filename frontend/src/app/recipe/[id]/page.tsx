import React from 'react';
import { RecipeDetailScreen } from '@/features/recipe-detail';

interface RecipeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function RecipeDetailPage({
  params,
}: RecipeDetailPageProps): Promise<React.JSX.Element> {
  const { id } = await params;
  return <RecipeDetailScreen recipeId={id} />;
}
