'use client';

import React from 'react';
import { PrinterIcon } from '@/shared/components/ui/icons';

// Abre el cuadro de impresion del sistema; la hoja de estilos de impresion deja solo la receta.
// En el celular se oculta: imprimir desde el telefono es raro y la barra fija no tiene espacio
export function PrintRecipeButton(): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="hidden sm:inline-flex h-8 items-center gap-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 px-3 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-[background-color,transform] duration-150 ease-out-strong hover:bg-zinc-100 dark:hover:bg-zinc-900 active:scale-[0.97] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <PrinterIcon className="w-3.5 h-3.5" />
      Imprimir
    </button>
  );
}
