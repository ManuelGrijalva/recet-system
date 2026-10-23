'use client';

import React, { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { PhotoCredit } from '@/shared/components/ui/PhotoCredit';

interface RecipeGalleryProps {
  title: string;
  images: string[];
  // Credito de la portada (primera foto), si viene de un banco con licencia libre
  coverCredit?: string | null;
  coverCreditUrl?: string | null;
}

// Foto grande y miniaturas para cambiarla; con una sola foto no muestra miniaturas
export function RecipeGallery({ title, images, coverCredit, coverCreditUrl }: RecipeGalleryProps): React.JSX.Element {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="space-y-2 mt-2">
      <div className="relative">
        <img
          src={current}
          alt={active === 0 ? title : `${title}, foto ${active + 1}`}
          className="w-full aspect-[4/3] object-cover rounded-lg border border-zinc-200 dark:border-zinc-800"
        />
        {active === 0 && <PhotoCredit credit={coverCredit} url={coverCreditUrl} className="bottom-2 right-2" />}
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Ver foto ${index + 1} de ${images.length}`}
              aria-current={index === active}
              className={cn(
                'rounded-md overflow-hidden border transition-opacity',
                index === active
                  ? 'border-zinc-900 dark:border-zinc-100'
                  : 'border-zinc-200 dark:border-zinc-800 opacity-60 hover:opacity-100',
              )}
            >
              <img src={url} alt="" loading="lazy" className="w-full aspect-[4/3] object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
