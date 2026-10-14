import { IsIn, IsInt, Max, Min } from 'class-validator';

export const RECIPE_IMAGE_TYPES = ['image/webp', 'image/jpeg'] as const;
export type RecipeImageType = (typeof RECIPE_IMAGE_TYPES)[number];

// El navegador comprime a ~1600px antes de subir; 3 MB deja holgura
export const RECIPE_IMAGE_MAX_BYTES = 3 * 1024 * 1024;

export class RequestImageUploadDto {
  @IsIn(RECIPE_IMAGE_TYPES, { message: 'La foto debe ser WebP o JPEG' })
  contentType!: RecipeImageType;

  @IsInt()
  @Min(1)
  @Max(RECIPE_IMAGE_MAX_BYTES, { message: 'La foto no debe pasar de 3 MB' })
  size!: number;
}
