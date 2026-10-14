import type { Metadata } from 'next';
import React from 'react';
import { PrivacyScreen } from '@/features/legal';

export const metadata: Metadata = { title: 'Política de privacidad | Recetario Jutiapa' };

export default function PrivacyPage(): React.JSX.Element {
  return <PrivacyScreen />;
}
