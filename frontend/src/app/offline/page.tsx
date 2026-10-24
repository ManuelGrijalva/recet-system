import type { Metadata } from 'next';
import React from 'react';
import { OfflineScreen } from '@/features/offline';

export const metadata: Metadata = { title: 'Sin conexión' };

export default function OfflinePage(): React.JSX.Element {
  return <OfflineScreen />;
}
