import React from 'react';
import { BrandMark } from '@/shared/components/ui/BrandMark';
import { TextileBand } from '@/shared/components/ui/TextileBand';

const dateFormatter = new Intl.DateTimeFormat('es-GT', { day: 'numeric', month: 'long', year: 'numeric' });

// Solo en papel: el mismo encabezado que el PDF (comal, nombre y franja tejida)
export function RecipePrintHeader(): React.JSX.Element {
  return (
    <div aria-hidden="true" className="hidden print:block">
      <div className="flex items-center justify-between gap-3 pb-2">
        <span className="flex items-center gap-2">
          <BrandMark size="sm" />
          <span className="font-serif text-base font-semibold text-zinc-900">Memoria del Comal</span>
        </span>
        <span className="text-xs text-zinc-500">Cocina tradicional de Jutiapa</span>
      </div>
      <TextileBand scale={0.5} />
    </div>
  );
}

// Solo en papel: de donde salio la receta
export function RecipePrintFooter({ recipeId }: { recipeId: string }): React.JSX.Element {
  return (
    <p aria-hidden="true" className="hidden border-t border-zinc-200 pt-3 text-xs text-zinc-500 print:block">
      Impreso desde memoriadelcomal.com/recipe/{recipeId} el {dateFormatter.format(new Date())}.
    </p>
  );
}
