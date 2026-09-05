'use client';

import React from 'react';
import { Button } from '@/shared/components/ui/Button';
import { GoogleIcon } from '@/shared/components/ui/icons';
import { useGoogleLogin } from '../hooks/useGoogleLogin';

export function GoogleLoginButton(): React.JSX.Element {
  const { isRedirecting, login } = useGoogleLogin();

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full flex items-center justify-center gap-3"
      onClick={login}
      isLoading={isRedirecting}
    >
      <GoogleIcon className="w-4 h-4" />
      <span>Continuar con Google</span>
    </Button>
  );
}
