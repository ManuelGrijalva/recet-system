import type { Metadata } from 'next';
import React from 'react';
import { EmptyState } from '@/shared/components/ui/EmptyState';

export const metadata: Metadata = { title: 'Página no encontrada' };

// 404 en español con la identidad del sitio
export default function NotFound(): React.JSX.Element {
  return (
    <EmptyState
      className="mt-10"
      title="Esta página no está en el recetario"
      description="Puede que el enlace esté incompleto o que la página ya no exista. Vuelve al inicio para seguir explorando recetas."
      action={{ href: '/', label: 'Volver al recetario', primary: true }}
    />
  );
}
