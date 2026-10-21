export type ShareOutcome = 'shared' | 'copied' | 'cancelled' | 'failed';

// En el celular abre el menu nativo (WhatsApp, Facebook...); en computadora copia el enlace
export async function shareRecipe(recipeId: string, title: string): Promise<ShareOutcome> {
  const url = `${window.location.origin}/recipe/${recipeId}`;

  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, text: `${title} - Memoria del Comal`, url });
      return 'shared';
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled';
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    return 'copied';
  } catch {
    return 'failed';
  }
}
