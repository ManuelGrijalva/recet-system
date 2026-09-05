import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import loginGuate from '@/shared/assets/login-guate.jpg';
import { BrandMark } from '@/shared/components/ui/BrandMark';
import { GoogleLoginButton } from './GoogleLoginButton';

/**
 * Pantalla de acceso a pantalla completa. Réplica monocromática del patrón
 * "split login": foto a la izquierda en escritorio; en móvil, una franja
 * superior delgada con un fragmento de la misma foto.
 *
 * Se monta como overlay (`fixed inset-0`) para salir del layout con barras
 * laterales del resto de la aplicación.
 */
export function LoginScreen(): React.JSX.Element {
  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white dark:bg-[#0a0a0a] md:flex-row">
      {/* Franja superior con fragmento de la foto (solo móvil) */}
      <div className="relative h-28 w-full shrink-0 overflow-hidden border-b border-zinc-200 dark:border-zinc-800 md:hidden">
        <Image
          src={loginGuate}
          alt="Cocina tradicional de Jutiapa"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/85 to-transparent dark:from-[#0a0a0a]/85" />
        <div className="absolute bottom-3 left-4 flex items-center gap-2">
          <BrandMark size="sm" />
          <span className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Recetario Jutiapa
          </span>
        </div>
      </div>

      {/* Panel de imagen (solo escritorio) */}
      <div className="relative hidden w-1/2 shrink-0 md:block">
        <Image
          src={loginGuate}
          alt="Cocina tradicional de Jutiapa"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <p className="text-lg font-medium">
            Rescate del patrimonio gastronómico de Jutiapa
          </p>
          <p className="mt-1 text-sm text-white/80">
            Comparte y preserva las recetas tradicionales de Guatemala.
          </p>
        </div>
      </div>

      {/* Panel del formulario */}
      <div className="flex w-full flex-1 items-center justify-center px-6 py-10 md:w-1/2">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center text-center">
            <div className="hidden md:block">
              <BrandMark size="lg" />
            </div>
            <h1 className="mt-4 text-2xl font-medium tracking-tight text-zinc-950 dark:text-zinc-50 md:text-3xl">
              Iniciar sesión
            </h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Te damos la bienvenida. Ingresa con tu cuenta de Google para continuar.
            </p>
          </div>

          <div className="mt-8">
            <GoogleLoginButton />
          </div>

          <p className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
            Al continuar aceptas las condiciones de uso y la política de privacidad.
          </p>

          <div className="mt-8 border-t border-zinc-100 dark:border-zinc-900 pt-6 text-center">
            <Link
              href="/"
              className="text-sm text-zinc-600 underline underline-offset-4 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
            >
              Explorar recetas como invitado
            </Link>
            <p className="mt-4 text-[11px] text-zinc-400">
              Proyecto de Graduación I · Universidad Mariano Gálvez de Guatemala · Campus Jutiapa
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
