import type { Metadata } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Lectura publica desde el servidor para titulos y vistas previas al compartir; si falla, la pagina usa un titulo generico
async function fetchPublic<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}/${path}`, { next: { revalidate: 300 } });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

interface RecipeMeta {
  title: string;
  description: string;
  coverImageUrl: string | null;
}

export async function recipeMetadata(id: string): Promise<Metadata> {
  const recipe = await fetchPublic<RecipeMeta>(`recipes/${id}`);
  if (!recipe) return { title: 'Receta' };
  return {
    title: recipe.title,
    description: recipe.description,
    // Vista previa con foto al compartir por WhatsApp o redes
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      images: recipe.coverImageUrl ? [recipe.coverImageUrl] : undefined,
    },
  };
}

export async function userMetadata(id: string): Promise<Metadata> {
  const user = await fetchPublic<{ name: string }>(`users/${id}`);
  return { title: user ? `${user.name}, cocinero de la comunidad` : 'Perfil' };
}
