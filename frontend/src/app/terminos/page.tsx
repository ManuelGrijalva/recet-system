import type { Metadata } from 'next';
import React from 'react';
import { TermsScreen } from '@/features/legal';

export const metadata: Metadata = { title: 'Condiciones del servicio | Memoria del Comal' };

export default function TermsPage(): React.JSX.Element {
  return <TermsScreen />;
}
