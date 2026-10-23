const DEFAULT_MAX_SIDE_PX = 1600;
const WEBP_QUALITY = 0.82;
const JPEG_QUALITY = 0.85;

export interface CompressedImage {
  blob: Blob;
  contentType: 'image/webp' | 'image/jpeg';
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

// Zona a conservar, en pixeles de la foto ya orientada
export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Recorta (si se indica), reduce al lado maximo y codifica en WebP (JPEG si el navegador no soporta WebP)
export async function compressImage(
  file: File,
  maxSide = DEFAULT_MAX_SIDE_PX,
  crop?: CropArea,
): Promise<CompressedImage> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    throw new Error('No se pudo leer la foto. Usa una imagen JPG, PNG o WebP.');
  }

  const source = crop ?? { x: 0, y: 0, width: bitmap.width, height: bitmap.height };
  const scale = Math.min(1, maxSide / Math.max(source.width, source.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(source.width * scale);
  canvas.height = Math.round(source.height * scale);

  const context = canvas.getContext('2d');
  if (!context) {
    bitmap.close();
    throw new Error('Tu navegador no permite procesar la foto.');
  }
  context.imageSmoothingQuality = 'high';
  context.drawImage(bitmap, source.x, source.y, source.width, source.height, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  // Safari antiguo devuelve PNG al pedir WebP: se detecta por el tipo del resultado
  const webp = await canvasToBlob(canvas, 'image/webp', WEBP_QUALITY);
  if (webp && webp.type === 'image/webp') {
    return { blob: webp, contentType: 'image/webp' };
  }

  const jpeg = await canvasToBlob(canvas, 'image/jpeg', JPEG_QUALITY);
  if (!jpeg) {
    throw new Error('No se pudo procesar la foto.');
  }
  return { blob: jpeg, contentType: 'image/jpeg' };
}
