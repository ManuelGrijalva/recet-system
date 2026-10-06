import { ApiError } from '@/shared/lib/apiClient';

export function describeModerationError(err: unknown): string {
  if (err instanceof ApiError && err.status === 401) {
    return 'Inicia sesión con una cuenta de administrador para continuar.';
  }
  if (err instanceof ApiError && err.status === 403) {
    return 'Esta sección es exclusiva del administrador de contenido.';
  }
  return err instanceof Error ? err.message : 'No se pudo completar la operación.';
}
