import type { Metadata } from 'next';
import React from 'react';
import { ProfileScreen } from '@/features/profile';

export const metadata: Metadata = { title: 'Mi perfil' };

export default function ProfilePage(): React.JSX.Element {
  return <ProfileScreen />;
}
