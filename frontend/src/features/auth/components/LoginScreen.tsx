import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import loginGuate from '@/shared/assets/login-guate.jpg';
import { BrandMark } from '@/shared/components/ui/BrandMark';
import { TextileBand } from '@/shared/components/ui/TextileBand';
import { GoogleLoginButton } from './GoogleLoginButton';
import { RedirectIfAuthenticated } from './RedirectIfAuthenticated';

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
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-background md:flex-row">
      <RedirectIfAuthenticated />
      {/* Franja superior con fragmento de la foto (solo móvil) */}
      <div className="relative h-56 w-full shrink-0 overflow-hidden md:hidden">
        <Image
          src={loginGuate}
          alt="Cocina tradicional de Jutiapa"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Franja oscura solida para que el texto se lea sobre la tela */}
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-2.5 bg-black/55 px-4 py-3">
          <BrandMark size="md" />
          <span>
            <span className="block font-serif text-base font-semibold text-white">Memoria del Comal</span>
            <span className="block text-xs text-white/85">Rescate del patrimonio gastronómico de Jutiapa</span>
          </span>
        </div>
      </div>
      <TextileBand scale={0.5} className="md:hidden" />

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
      <div className="flex w-full flex-1 items-start justify-center px-6 pb-24 pt-8 md:w-1/2 md:items-center md:py-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center text-center">
            <div className="hidden md:block">
              <BrandMark size="lg" />
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight md:mt-4 text-zinc-950 dark:text-zinc-50 md:text-3xl">
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
            Al continuar aceptas las{' '}
            <Link href="/terminos" className="underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-100">
              condiciones del servicio
            </Link>{' '}
            y la{' '}
            <Link href="/privacidad" className="underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-100">
              política de privacidad
            </Link>
            .
          </p>

          <div className="mt-8 border-t border-zinc-100 dark:border-zinc-900 pt-6 text-center">
            <Link
              href="/"
              className="text-sm text-zinc-600 underline underline-offset-4 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
            >
              Explorar recetas como invitado
            </Link>
            <p className="mt-4 text-xs text-zinc-400">
              Proyecto de Graduación I · Universidad Mariano Gálvez de Guatemala · Campus Jutiapa
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
