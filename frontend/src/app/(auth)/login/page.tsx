import type { Metadata } from 'next';
import React from 'react';
import { LoginScreen } from '@/features/auth';

export const metadata: Metadata = { title: 'Iniciar sesión' };

export default function LoginPage(): React.JSX.Element {
  return <LoginScreen />;
}
