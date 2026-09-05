import type { CatalogRecipe } from '../types';

export const recipeCatalogMock: CatalogRecipe[] = [
  {
    id: '1',
    title: 'Quesadilla de Arroz de Jutiapa',
    region: 'Jutiapa',
    required: [
      'Harina de arroz',
      'Queso artesanal',
      'Crema fresca de vaca',
      'Huevos de patio',
      'Ajonjolí tostado',
    ],
  },
  {
    id: '2',
    title: 'Salpores de Almidón Tradicionales',
    region: 'Jutiapa',
    required: [
      'Almidón de yuca',
      'Manteca de cerdo',
      'Panela / Chancaca',
      'Canela en raja',
    ],
  },
  {
    id: '3',
    title: 'Gallo en Chicha al Estilo de Oriente',
    region: 'Asunción Mita',
    required: [
      'Gallina criolla',
      'Panela / Chancaca',
      'Pimienta gorda',
      'Clavos de olor',
      'Canela en raja',
    ],
  },
];
