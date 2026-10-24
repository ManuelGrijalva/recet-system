import type { Metadata } from 'next';
import React from 'react';
import { IngredientSearchScreen } from '@/features/ingredient-search';

export const metadata: Metadata = { title: 'Buscar por ingredientes' };

export default function SearchPage(): React.JSX.Element {
  return <IngredientSearchScreen />;
}
