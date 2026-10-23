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

// Serifa de recetario para titulos; Next la sirve desde el propio dominio
const serif = Lora({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });

export const metadata: Metadata = {
  title: 'Memoria del Comal | Cocina tradicional de Jutiapa',
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
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="es" className={`h-full ${serif.variable}`}>
      <body className="min-h-full bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 antialiased selection:bg-zinc-200 dark:selection:bg-zinc-800">
        <ServiceWorkerRegistrar />
        <SessionProvider>
          <div className="flex min-h-screen">
            {/* 1. Navegación Lateral Izquierda (Desktop) */}
            <DesktopSidebar />

            {/* 2. Encabezado Móvil (Solo visible en pantallas pequeñas) */}
            <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800 z-40 px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrandMark size="sm" />
                <span className="font-serif font-semibold text-sm text-zinc-950 dark:text-zinc-50">
                  Memoria del Comal
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">
                  Jutiapa
                </span>
              </div>
            </header>

            {/* 3. Área Central del Feed (Contenido Principal) */}
            <main className="flex-1 md:pl-64 lg:pr-80 pt-14 md:pt-0 pb-20 md:pb-10 flex justify-center">
              <div className="w-full max-w-2xl px-4 py-6">
                {children}
              </div>
            </main>

            {/* 4. Barra Lateral Derecha (Desktop LG: Sugerencias y Tendencias Culinarias) */}
            <RightSidebar />

            {/* 5. Barra de Navegación Inferior Fija (Móvil) */}
            <MobileBottomNav />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
