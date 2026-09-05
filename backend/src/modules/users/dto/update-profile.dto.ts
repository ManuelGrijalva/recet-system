import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  /**
   * Teléfono del usuario: privado y editable según requerimiento del MVP
   */
  @IsOptional()
  @IsString()
  @MaxLength(25)
  phone?: string;
}
