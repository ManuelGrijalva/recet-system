import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content!: string;

  /**
   * ID del comentario padre si es una respuesta (1 solo nivel permitido)
   */
  @IsOptional()
  @IsUUID()
  parentId?: string;
}
