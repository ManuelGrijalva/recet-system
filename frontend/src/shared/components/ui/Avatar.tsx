'use client';

import React, { useState } from 'react';

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallbackName?: string;
}

export function Avatar({
  src,
  alt,
  size = 'md',
  fallbackName = 'Usuario',
}: AvatarProps): React.JSX.Element {
  // Si la foto no carga (enlace vencido o bloqueado) se muestran las iniciales en vez del texto alternativo cortado
  const [failed, setFailed] = useState(false);
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
    // Perfil: foto superpuesta a la portada
    xl: 'w-20 h-20 sm:w-24 sm:h-24 text-2xl',
  };

  const initials = fallbackName
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase(); // Iniciales en dos letras

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={`${sizeClasses[size]} rounded-full object-cover border border-zinc-200 dark:border-zinc-800 shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-medium shrink-0`}
      aria-label={alt}
    >
      {initials || 'U'}
    </div>
  );
}
