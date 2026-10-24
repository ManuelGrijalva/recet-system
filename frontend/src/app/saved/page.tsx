import type { Metadata } from 'next';
import React from 'react';
import { SavedRecipesScreen } from '@/features/saved-recipes';

export const metadata: Metadata = { title: 'Recetario guardado' };

export default function SavedRecipesPage(): React.JSX.Element {
  return <SavedRecipesScreen />;
}
