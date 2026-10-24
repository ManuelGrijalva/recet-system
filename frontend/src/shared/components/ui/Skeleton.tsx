import React from 'react';
import { cn } from '../../lib/utils';

// Bloque de carga; el pulso se apaga con movimiento reducido
export function Skeleton({ className }: { className?: string }): React.JSX.Element {
  return <div aria-hidden="true" className={cn('rounded-md bg-zinc-200/70 motion-safe:animate-pulse dark:bg-zinc-800', className)} />;
}

interface LoadingRegionProps {
  label: string;
  className?: string;
  children: React.ReactNode;
}

// Contenedor que anuncia la carga a los lectores de pantalla mientras se ven los esqueletos
export function LoadingRegion({ label, className, children }: LoadingRegionProps): React.JSX.Element {
  return (
    <div role="status" aria-live="polite" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

// Filas con miniatura y dos lineas: listas de recetas, solicitudes y usuarios
// Sin label no se anuncia: sirve dentro de otro LoadingRegion
export function SkeletonList({ rows = 3, label }: { rows?: number; label?: string }): React.JSX.Element {
  const items = Array.from({ length: rows }, (_, index) => (
    <div key={index} className="flex items-center gap-3">
      <Skeleton className="h-12 w-12 shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-3/5" />
        <Skeleton className="h-3 w-2/5" />
      </div>
    </div>
  ));
  return label ? (
    <LoadingRegion label={label} className="space-y-3">
      {items}
    </LoadingRegion>
  ) : (
    <div aria-hidden="true" className="space-y-3">
      {items}
    </div>
  );
}

// Tarjeta de receta del feed mientras llega
export function RecipeCardSkeleton(): React.JSX.Element {
  return (
    <div aria-hidden="true" className="overflow-hidden rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-[#1c1712]">
      <div className="flex items-center gap-3 p-4">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-36" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-2.5 p-4">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-4/5" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
    </div>
  );
}

// Encabezado de perfil (portada, foto y nombre) mientras llega
export function ProfileSkeleton({ label }: { label: string }): React.JSX.Element {
  return (
    <LoadingRegion label={label} className="space-y-6">
      <div className="overflow-hidden rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-[#1c1712]">
        <Skeleton className="h-36 w-full rounded-none sm:h-48" />
        <div className="space-y-2.5 p-5">
          <Skeleton className="-mt-14 h-20 w-20 rounded-full border-4 border-white dark:border-[#1c1712] sm:h-24 sm:w-24" />
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3.5 w-24" />
          <div className="flex gap-4 pt-1">
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3.5 w-16" />
          </div>
        </div>
      </div>
      <SkeletonList rows={3} />
    </LoadingRegion>
  );
}
