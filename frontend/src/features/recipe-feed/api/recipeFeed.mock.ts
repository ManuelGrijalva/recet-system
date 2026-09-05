import type { RecipeFeedPage } from '../types';

/**
 * Datos semilla del feed. Se usan como fallback cuando el backend NestJS
 * no está disponible (ver `getRecipeFeed`).
 */
export const recipeFeedMock: RecipeFeedPage = {
  total: 2,
  items: [
    {
      id: '1',
      title: 'Quesadilla de Arroz Tradicional de Jutiapa',
      description:
        'Auténtica quesadilla jutiapaneca elaborada con harina de arroz, queso fresco artesanal, crema criolla y horneada a fuego constante.',
      prepTimeMinutes: 20,
      cookTimeMinutes: 40,
      servings: 12,
      difficulty: 'MEDIUM',
      coverImageUrl: null,
      originRegion: 'Jutiapa, Jutiapa',
      status: 'PUBLISHED',
      createdAt: '2026-09-02T14:00:00.000Z',
      author: {
        id: 'u1',
        name: 'Doña Rosalía Gómez',
        avatarUrl: null,
      },
      reactionCounts: { like: 42, yummy: 68, triedIt: 19 },
      commentsCount: 14,
    },
    {
      id: '2',
      title: 'Gallo en Chicha al Estilo de Oriente',
      description:
        'Gallo de patio marinado en chicha tradicional con panela, pimienta gorda, clavo y canela. Un manjar festivo de la cultura de Oriente.',
      prepTimeMinutes: 30,
      cookTimeMinutes: 60,
      servings: 8,
      difficulty: 'HARD',
      coverImageUrl: null,
      originRegion: 'Asunción Mita, Jutiapa',
      status: 'PUBLISHED',
      createdAt: '2026-08-28T18:30:00.000Z',
      author: {
        id: 'u2',
        name: 'Carlos Menéndez',
        avatarUrl: null,
      },
      reactionCounts: { like: 35, yummy: 54, triedIt: 12 },
      commentsCount: 8,
    },
  ],
};
