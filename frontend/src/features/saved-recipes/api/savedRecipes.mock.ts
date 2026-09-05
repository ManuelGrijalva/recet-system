import type { SavedRecipe } from '../types';

export const savedRecipesMock: SavedRecipe[] = [
  {
    id: '1',
    title: 'Quesadilla de Arroz Tradicional de Jutiapa',
    author: 'Doña Rosalía Gómez',
    region: 'Jutiapa',
    timeMinutes: 60,
    savedLabel: 'Guardado el 2 de septiembre',
  },
  {
    id: '2',
    title: 'Gallo en Chicha al Estilo de Oriente',
    author: 'Carlos Menéndez',
    region: 'Asunción Mita',
    timeMinutes: 90,
    savedLabel: 'Guardado el 28 de agosto',
  },
];
