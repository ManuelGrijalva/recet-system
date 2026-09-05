/**
 * Entrada del recetario guardado del usuario.
 * TODO(backend): alinear con la forma real de `GET /interactions/bookmarks`
 * cuando se defina; hoy el endpoint devuelve los marcadores sin este detalle.
 */
export interface SavedRecipe {
  id: string;
  title: string;
  author: string;
  region: string;
  timeMinutes: number;
  savedLabel: string;
}
