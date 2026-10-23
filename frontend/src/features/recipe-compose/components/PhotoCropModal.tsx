'use client';

import React, { useEffect, useState } from 'react';
import Cropper, { type Area, type Point } from 'react-easy-crop';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import type { CropArea } from '@/shared/lib/compressImage';
import { RECIPE_PHOTO_ASPECT } from '../lib/recipePhotos';

interface PhotoCropModalProps {
  file: File;
  // Cuantas fotos elegidas faltan por ajustar despues de esta
  remaining: number;
  onConfirm: (area: CropArea) => void;
  onSkip: () => void;
}

// Encuadre de la foto antes de comprimirla: arrastrar para mover y zoom para acercar
export function PhotoCropModal({ file, remaining, onConfirm, onSkip }: PhotoCropModalProps): React.JSX.Element {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <Modal isOpen onClose={onSkip} title="Ajustar foto">
      <div className="space-y-4">
        <div className="relative h-72 sm:h-80 rounded-md overflow-hidden bg-zinc-950">
          {imageUrl && (
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              maxZoom={4}
              aspect={RECIPE_PHOTO_ASPECT}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, pixels) => setArea(pixels)}
            />
          )}
        </div>

        <label className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400">
          <span className="shrink-0">Zoom</span>
          <input
            type="range"
            min={1}
            max={4}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-zinc-900 dark:accent-zinc-100"
          />
        </label>

        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
          Arrastra la foto para encuadrar el platillo. Así se verá en el feed y en la receta.
          {remaining > 0 && ` Después siguen ${remaining} ${remaining === 1 ? 'foto' : 'fotos'} más.`}
        </p>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onSkip}>
            No usar esta foto
          </Button>
          <Button type="button" size="sm" disabled={!area} onClick={() => area && onConfirm(area)}>
            Usar foto
          </Button>
        </div>
      </div>
    </Modal>
  );
}
