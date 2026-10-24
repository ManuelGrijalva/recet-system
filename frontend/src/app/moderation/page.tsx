import type { Metadata } from 'next';
import React from 'react';
import { ModerationScreen } from '@/features/moderation';

export const metadata: Metadata = { title: 'Validar recetas' };

export default function ModerationPage(): React.JSX.Element {
  return <ModerationScreen />;
}
