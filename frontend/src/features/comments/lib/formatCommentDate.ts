/**
 * Fecha corta y localizada para comentarios ("5 sep").
 */
export function formatCommentDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-GT', {
    month: 'short',
    day: 'numeric',
  });
}
