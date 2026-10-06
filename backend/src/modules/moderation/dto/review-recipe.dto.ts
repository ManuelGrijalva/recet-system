import { IsIn, IsNotEmpty, IsString, MaxLength, ValidateIf } from 'class-validator';

export class ReviewRecipeDto {
  @IsIn(['APPROVE', 'RETURN'])
  decision!: 'APPROVE' | 'RETURN';

  // Obligatorias solo al devolver la receta al autor
  @ValidateIf((dto: ReviewRecipeDto) => dto.decision === 'RETURN')
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  notes?: string;
}
