import type { Metadata, Viewport } from 'next';
import { Lora } from 'next/font/google';
import React from 'react';
import '../styles/globals.css';
import { DesktopSidebar } from '../shared/components/layout/DesktopSidebar';
import { MobileBottomNav } from '../shared/components/layout/MobileBottomNav';
import { RightSidebar } from '../shared/components/layout/RightSidebar';
import { BrandMark } from '../shared/components/ui/BrandMark';
import { SessionProvider } from '../shared/session';
import { ServiceWorkerRegistrar } from '../shared/pwa';
import { ToastProvider } from '@/shared/components/ui/Toast';
import Link from 'next/link';
import { SearchIcon } from '@/shared/components/ui/icons';

// Serifa de recetario para titulos; Next la sirve desde el propio dominio
const serif = Lora({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });

export const metadata: Metadata = {
  // Cada pagina pone su nombre en la pestana: "Chojin | Memoria del Comal"
  title: {
    default: 'Memoria del Comal | Cocina tradicional de Jutiapa',
    template: '%s | Memoria del Comal',
  },
  description:
    'Plataforma para el rescate y difusión de recetas tradicionales guatemaltecas con búsqueda inteligente por ingredientes disponibles.',
  keywords: [
    'recetas tradicionales',
    'gastronomía guatemalteca',
    'Jutiapa',
    'búsqueda por ingredientes',
    'recetario comunitario',
  ],
  authors: [{ name: 'Manuel Ernesto Grijalva Tenas' }],
  applicationName: 'Memoria del Comal',
  appleWebApp: { capable: true, title: 'Memoria del Comal', statusBarStyle: 'default' },
  icons: {
    icon: [
      { url: '/icons/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#f8f1e5',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="es" className={`h-full ${serif.variable}`}>
      <body className="min-h-full bg-background text-zinc-900 dark:text-zinc-100 antialiased selection:bg-zinc-200 dark:selection:bg-zinc-800">
        <ServiceWorkerRegistrar />
        <SessionProvider>
          <ToastProvider>
          {/* Primer elemento al pulsar Tab: lleva directo al contenido sin recorrer el menu */}
          <a
            href="#contenido"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
          >
            Saltar al contenido
          </a>
          <div className="flex min-h-screen">
            {/* 1. Navegación Lateral Izquierda (Desktop) */}
            <DesktopSidebar />

            {/* 2. Encabezado Móvil (Solo visible en pantallas pequeñas) */}
            <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#f8f1e5]/90 dark:bg-[#15110d]/90 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800 z-40 px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrandMark size="sm" />
                <span className="font-serif font-semibold text-sm text-zinc-950 dark:text-zinc-50">
                  Memoria del Comal
                </span>
              </div>
              {/* Acceso directo a la funcion principal: buscar con lo que hay en la cocina */}
              <Link
                href="/search"
                aria-label="Buscar recetas por ingredientes"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-zinc-700 transition-colors hover:bg-zinc-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                <SearchIcon className="h-5 w-5" />
              </Link>
            </header>

            {/* 3. Área Central del Feed (Contenido Principal) */}
            <main id="contenido" tabIndex={-1} className="min-w-0 flex-1 focus:outline-none md:pl-64 lg:pr-80 pt-14 md:pt-0 pb-20 md:pb-10 flex justify-center">
              {/* Columna de papel: el tapiz se ve desenfocado detras del contenido y nitido en los margenes */}
              <div className="relative w-full min-w-0 max-w-2xl min-h-screen px-4 py-6 md:px-6 md:border-x md:border-zinc-200/80 dark:md:border-zinc-800">
                {/* El desenfoque va en una capa hermana y no en la columna: un ancestro con filtro romperia los modales fixed */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[#f8f1e5]/[0.62] backdrop-blur-[3px] dark:bg-transparent dark:backdrop-blur-none" />
                {children}
              </div>
            </main>

            {/* 4. Barra Lateral Derecha (Desktop LG: Sugerencias y Tendencias Culinarias) */}
            <RightSidebar />

            {/* 5. Barra de Navegación Inferior Fija (Móvil) */}
            <MobileBottomNav />
          </div>
        </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
