import type { Metadata } from 'next';
import React from 'react';
import { RecipeDetailScreen } from '@/features/recipe-detail';
import { recipeMetadata } from '@/shared/lib/serverMetadata';

interface RecipeDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: RecipeDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return recipeMetadata(id);
}

export default async function RecipeDetailPage({
  params,
}: RecipeDetailPageProps): Promise<React.JSX.Element> {
  const { id } = await params;
  return <RecipeDetailScreen recipeId={id} />;
}
