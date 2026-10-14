import React, { useRef } from 'react';
import { Button } from '@/shared/components/ui/Button';

interface CoverImageFieldProps {
  imageUrl: string | null;
  isUploading: boolean;
  error: string | null;
  onSelectFile: (file: File) => void;
  onRemove: () => void;
}

export function CoverImageField({
  imageUrl,
  isUploading,
  error,
  onSelectFile,
  onRemove,
}: CoverImageFieldProps): React.JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-3 p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a]">
      <div>
        <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Foto del platillo</p>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
          Opcional. Se reduce automáticamente antes de subirla.
        </p>
      </div>

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Foto de portada de la receta"
          className="w-full aspect-[4/3] object-cover rounded-md border border-zinc-200 dark:border-zinc-800"
        />
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onSelectFile(file);
          // Permite volver a elegir el mismo archivo tras un error
          e.target.value = '';
        }}
      />

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          isLoading={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? 'Subiendo foto...' : imageUrl ? 'Cambiar foto' : 'Elegir foto'}
        </Button>
        {imageUrl && !isUploading && (
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
            Quitar foto
          </Button>
        )}
      </div>

      {error && <p className="text-xs text-zinc-700 dark:text-zinc-300">{error}</p>}
    </div>
  );
}
