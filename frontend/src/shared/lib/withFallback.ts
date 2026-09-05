/**
 * Ejecuta una llamada al backend y, si falla (backend caído, sin sesión, red),
 * devuelve datos semilla para que la demo siga renderizando.
 *
 * Cada slice usa esto en su capa `api/` para exponer una función que "siempre
 * resuelve" sin acoplar los componentes al estado del backend.
 */
export async function withFallback<T>(
  request: () => Promise<T>,
  fallback: T | (() => T),
): Promise<T> {
  try {
    return await request();
  } catch {
    return typeof fallback === 'function'
      ? (fallback as () => T)()
      : fallback;
  }
}
