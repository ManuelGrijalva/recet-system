import type { RecipeDetail } from '../types';

export const recipeDetailMock: Record<string, RecipeDetail> = {
  '1': {
    id: '1',
    title: 'Quesadilla de Arroz Tradicional de Jutiapa',
    description:
      'La quesadilla de arroz jutiapaneca es una de las joyas de la repostería criolla tradicional del oriente de Guatemala. Se hornea con queso artesanal fresco seco o duro, crema de leche de vaca criolla, azúcar, huevos frescos y harina de arroz fina, decorada con ajonjolí dorado.',
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
      role: 'Cocinera tradicional jutiapaneca',
    },
    reactionCounts: { like: 42, yummy: 68, triedIt: 19 },
    userReaction: 'YUMMY',
    ingredients: [
      { name: 'Harina de arroz fina', quantity: '1', unit: 'libra' },
      { name: 'Queso criollo artesanal de Jutiapa (rallado)', quantity: '1/2', unit: 'libra' },
      { name: 'Crema fresca pura de vaca', quantity: '1', unit: 'taza' },
      { name: 'Azúcar refinada o de caña', quantity: '1', unit: 'libra' },
      { name: 'Huevos de patio', quantity: '4', unit: 'unidades' },
      { name: 'Polvo de hornear', quantity: '1', unit: 'cucharadita' },
      { name: 'Ajonjolí tostado para decorar', quantity: '2', unit: 'cucharadas' },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction:
          'En un recipiente amplio, bata los huevos hasta que adquieran una consistencia espumosa y color claro.',
      },
      {
        stepNumber: 2,
        instruction:
          'Incorpore el azúcar de forma gradual sin dejar de batir, hasta que se disuelva por completo.',
      },
      {
        stepNumber: 3,
        instruction:
          'Agregue la crema fresca de vaca y el queso artesanal finamente rallado, mezclando de manera envolvente.',
      },
      {
        stepNumber: 4,
        instruction:
          'Cierna la harina de arroz junto con el polvo de hornear y añádala poco a poco a la preparación hasta lograr una mezcla homogénea sin grumos.',
      },
      {
        stepNumber: 5,
        instruction:
          'Vierta la mezcla en moldes metálicos previamente engrasados, espolvoree el ajonjolí en la superficie y hornee a 180°C durante 40 a 45 minutos hasta que adquiera un tono dorado.',
      },
    ],
  },
};

export const recipeDetailFallback: RecipeDetail = recipeDetailMock['1'];
