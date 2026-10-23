// Portada + 4 fotos, igual que el limite del backend
export const MAX_RECIPE_PHOTOS = 5;

// Proporcion del recorte; el feed y el detalle muestran las fotos asi
export const RECIPE_PHOTO_ASPECT = 4 / 3;

export function moveToFront(images: string[], index: number): string[] {
  const picked = images[index];
  if (picked === undefined) return images;
  return [picked, ...images.filter((_, i) => i !== index)];
}

export function removeAt(images: string[], index: number): string[] {
  return images.filter((_, i) => i !== index);
}
