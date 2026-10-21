import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class MyReactionsDto {
  // Ids separados por comas de las recetas visibles en pantalla (maximo 50)
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9a-f-]{36}(,[0-9a-f-]{36}){0,49}$/i, { message: 'recipeIds debe ser una lista de hasta 50 ids' })
  recipeIds!: string;
}
