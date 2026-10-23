import {
  ArrayMaxSize,
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

// Portada + 4 fotos mas
export const MAX_GALLERY_IMAGES = 4;

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

  // null quita la foto al editar
  @IsOptional()
  @IsString()
  coverImageUrl?: string | null;

  // Fotos despues de la portada, en orden; ausente conserva la galeria al editar y [] la vacia
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(MAX_GALLERY_IMAGES, { message: `Una receta admite hasta ${MAX_GALLERY_IMAGES + 1} fotos` })
  @IsString({ each: true })
  galleryImageUrls?: string[];

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
