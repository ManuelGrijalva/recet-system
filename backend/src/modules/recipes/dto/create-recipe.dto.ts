import {
  IsArray,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RecipeStepDto {
  @IsInt()
  @Min(1)
  stepNumber!: number;

  @IsString()
  @IsNotEmpty()
  instruction!: string;

  @IsOptional()
  @IsInt()
  estimatedMinutes?: number;
}

export class RecipeIngredientInputDto {
  @IsString()
  @IsNotEmpty()
  ingredientName!: string; // Se crea o vincula al catalogo oficial

  @IsString()
  @IsNotEmpty()
  quantity!: string; // ej: "2", "1/2"

  @IsString()
  @IsNotEmpty()
  unit!: string; // ej: "tazas", "libras"

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsInt()
  @Min(0)
  prepTimeMinutes!: number;

  @IsInt()
  @Min(0)
  cookTimeMinutes!: number;

  @IsInt()
  @Min(1)
  servings!: number;

  @IsEnum(['EASY', 'MEDIUM', 'HARD'])
  difficulty!: 'EASY' | 'MEDIUM' | 'HARD';

  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @IsOptional()
  @IsIn(['DRAFT', 'PUBLISHED', 'PENDING_REVIEW'])
  status?: 'DRAFT' | 'PUBLISHED' | 'PENDING_REVIEW';

  @IsOptional()
  @IsString()
  originRegion?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeStepDto)
  instructions!: RecipeStepDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeIngredientInputDto)
  ingredients!: RecipeIngredientInputDto[];
}
