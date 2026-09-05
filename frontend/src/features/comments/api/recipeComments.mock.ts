import type { CommentData } from '../types';

/**
 * Hilo semilla usado como fallback cuando el backend no responde.
 * La clave es el `recipeId`.
 */
export const recipeCommentsMock: Record<string, CommentData[]> = {
  '1': [
    {
      id: 'c1',
      content:
        'El queso artesanal de Jutiapa le da ese sabor saladito y dulce tan característico. ¡Una delicia!',
      createdAt: '2026-09-03T12:00:00.000Z',
      parentId: null,
      author: { id: 'u1', name: 'Carlos Menéndez', avatarUrl: null },
      replies: [
        {
          id: 'c1-1',
          content:
            'Así es, si consiguen queso de cincho de la región sale todavía más auténtica.',
          createdAt: '2026-09-03T13:30:00.000Z',
          parentId: 'c1',
          author: { id: 'u2', name: 'Doña Rosalía Gómez', avatarUrl: null },
        },
      ],
    },
  ],
};
