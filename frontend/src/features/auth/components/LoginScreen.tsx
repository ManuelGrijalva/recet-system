import React from 'react';
import Link from 'next/link';
import { BrandMark } from '@/shared/components/ui/BrandMark';
import { GoogleLoginButton } from './GoogleLoginButton';

export function LoginScreen(): React.JSX.Element {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-sm space-y-6 p-6 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] shadow-sm text-center">
        <div className="flex flex-col items-center gap-2">
          <BrandMark size="lg" />
          <h1 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Recetario Jutiapa
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Inicia sesión para publicar tus recetas tradicionales, guardar favoritos y compartir con la comunidad gastronómica.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <GoogleLoginButton />
        </div>

        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 text-[11px] text-zinc-400 space-y-1">
          <p>Proyecto de Graduación l · Universidad Mariano Gálvez de Guatemala</p>
          <p>Rescate del Patrimonio Gastronómico de Jutiapa</p>
          <div className="pt-2">
            <Link href="/" className="hover:underline text-zinc-600 dark:text-zinc-300">
              Explorar recetas como invitado
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
