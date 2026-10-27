import React, { useRef } from 'react';
import { Notice } from '@/shared/components/ui/Notice';
import { Button } from '@/shared/components/ui/Button';
import { MAX_RECIPE_PHOTOS } from '../lib/recipePhotos';

interface RecipePhotosFieldProps {
  images: string[];
  uploadingCount: number;
  error: string | null;
  onSelectFiles: (files: File[]) => void;
  onMakeCover: (index: number) => void;
  onRemove: (index: number) => void;
}

export function RecipePhotosField({
  images,
  uploadingCount,
  error,
  onSelectFiles,
  onMakeCover,
  onRemove,
}: RecipePhotosFieldProps): React.JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const isFull = images.length + uploadingCount >= MAX_RECIPE_PHOTOS;

  return (
    <div className="space-y-3 p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1c1712]">
      {(images.length > 0 || uploadingCount > 0) && (
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((url, index) => (
            <li key={url} className="space-y-1.5">
              <div className="relative">
                <img
                  src={url}
                  alt={index === 0 ? 'Portada de la receta' : `Foto ${index + 1} de la receta`}
                  className="w-full aspect-[4/3] object-cover rounded-md border border-zinc-200 dark:border-zinc-800"
                />
                {index === 0 && (
                  <span className="absolute top-1.5 left-1.5 text-xs font-medium px-1.5 py-0.5 rounded-md bg-white/90 text-zinc-900 dark:bg-[#15110d]/90 dark:text-zinc-100">
                    Portada
                  </span>
                )}
              </div>
              <div className="flex gap-1">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => onMakeCover(index)}
                    className="text-xs px-1.5 py-0.5 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    Hacer portada
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="text-xs px-1.5 py-0.5 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  Quitar
                </button>
              </div>
            </li>
          ))}
          {Array.from({ length: uploadingCount }, (_, i) => (
            <li key={`subiendo-${i}`}>
              <div className="w-full aspect-[4/3] rounded-md border border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-xs text-zinc-500 animate-pulse">
                Subiendo...
              </div>
            </li>
          ))}
        </ul>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length > 0) onSelectFiles(files);
          // Permite volver a elegir los mismos archivos
          e.target.value = '';
        }}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isFull}
        onClick={() => inputRef.current?.click()}
      >
        {isFull ? 'Llegaste al máximo de fotos' : images.length > 0 ? 'Agregar más fotos' : 'Elegir fotos'}
      </Button>

      {error && (
        <Notice tone="danger" role="alert">
          {error}
        </Notice>
      )}
    </div>
  );
}
