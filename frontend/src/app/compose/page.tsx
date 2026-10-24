import type { Metadata } from 'next';
import React from 'react';
import { RecipeComposerScreen } from '@/features/recipe-compose';

export const metadata: Metadata = { title: 'Publicar receta' };

export default function ComposePage(): React.JSX.Element {
  return <RecipeComposerScreen />;
}
