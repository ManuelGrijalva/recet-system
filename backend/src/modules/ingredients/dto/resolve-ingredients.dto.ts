import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ResolveIngredientsDto {
  // Terminos separados por comas, como en /recipes/search
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  terms!: string;
}
