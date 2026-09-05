import type { Metadata } from 'next';
import React from 'react';
import '../styles/globals.css';
import { DesktopSidebar } from '../shared/components/layout/DesktopSidebar';
import { MobileBottomNav } from '../shared/components/layout/MobileBottomNav';
import { RightSidebar } from '../shared/components/layout/RightSidebar';

export const metadata: Metadata = {
  title: 'Recetario Tradicional de Jutiapa | Red Social Culinaria',
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
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 antialiased selection:bg-zinc-200 dark:selection:bg-zinc-800">
        <div className="flex min-h-screen">
          {/* 1. Navegación Lateral Izquierda (Desktop) */}
          <DesktopSidebar />

          {/* 2. Encabezado Móvil (Solo visible en pantallas pequeñas) */}
          <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800 z-40 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs">
                R
              </div>
              <span className="font-semibold text-sm tracking-tight text-zinc-950 dark:text-zinc-50">
                Recetario Jutiapa
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
      </body>
    </html>
  );
}
