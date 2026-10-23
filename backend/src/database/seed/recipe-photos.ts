// Fotos con licencia libre de Wikimedia Commons para recetas del catalogo inicial.
// Revisadas una por una: solo se asigna una foto que muestra el mismo platillo.
// "equivalente" marca fotos de otro pais de un platillo que se prepara igual en Guatemala.
export interface RecipePhoto {
  recipeTitle: string;
  commonsFile: string;
  origin: 'guatemala' | 'equivalente';
}

export const recipePhotos: RecipePhoto[] = [
  { recipeTitle: 'Atol de elote', commonsFile: 'File:100320 atol de elote guatemala.JPG', origin: 'guatemala' },
  { recipeTitle: 'Pepián de pollo', commonsFile: 'File:Pepián Guatemala.jpg', origin: 'guatemala' },
  { recipeTitle: 'Rellenitos de plátano', commonsFile: 'File:Rellenitos-de-platano-01.jpg', origin: 'guatemala' },
  { recipeTitle: 'Caldo de res', commonsFile: 'File:Cocido, o caldo de res.jpg', origin: 'guatemala' },
  { recipeTitle: 'Chuchitos', commonsFile: 'File:Chuchito-canak.jpg', origin: 'guatemala' },
  { recipeTitle: 'Tamal de viaje', commonsFile: 'File:080924 tamal de viaje.JPG', origin: 'guatemala' },
  { recipeTitle: 'Chiles rellenos', commonsFile: 'File:Chile Rellenos.jpg', origin: 'equivalente' },
  { recipeTitle: 'Arroz con pollo', commonsFile: 'File:Arroz-con-Pollo.jpg', origin: 'equivalente' },
  { recipeTitle: 'Caldo de gallina criolla', commonsFile: 'File:Caldo de gallina 06092009.jpg', origin: 'equivalente' },
];
