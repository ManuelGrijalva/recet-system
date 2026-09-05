import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchRecipesDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';

  /**
   * Lista de ingredientes disponibles separados por comas.
   * Ej: "arroz,crema,queso"
   * Cumple con numeral 3.4.2 y Tabla 20 (Criterios de aceptacion de busqueda por ingredientes).
   */
  @IsOptional()
  @IsString()
  ingredients?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
