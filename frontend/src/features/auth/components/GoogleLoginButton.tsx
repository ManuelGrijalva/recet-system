'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/Button';
import googleLogo from '@/shared/assets/google.svg';
import { useGoogleLogin } from '../hooks/useGoogleLogin';

interface GoogleLoginButtonProps {
  className?: string;
}

/**
 * Único botón de acceso: redirige al flujo OAuth de Google del backend.
 * Usa el logotipo cargado en `shared/assets/google.svg`.
 */
export function GoogleLoginButton({
  className,
}: GoogleLoginButtonProps = {}): React.JSX.Element {
  const { isRedirecting, login } = useGoogleLogin();

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className={cn('w-full flex items-center justify-center gap-3', className)}
      onClick={login}
      isLoading={isRedirecting}
    >
      <Image
        src={googleLogo}
        alt=""
        aria-hidden
        width={18}
        height={18}
        className="h-[18px] w-[18px] shrink-0"
      />
      <span>Iniciar sesión con Google</span>
    </Button>
  );
}
