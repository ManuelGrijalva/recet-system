import type { Metadata } from 'next';
import React from 'react';
import { TermsScreen } from '@/features/legal';

export const metadata: Metadata = { title: 'Condiciones del servicio | Recetario Jutiapa' };

export default function TermsPage(): React.JSX.Element {
  return <TermsScreen />;
}
