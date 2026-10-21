import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  // Debe venir de la subida a R2 del propio usuario; null vuelve a la foto de Google
  @IsOptional()
  @IsString()
  avatarUrl?: string | null;

  // Igual que avatarUrl; null quita la portada
  @IsOptional()
  @IsString()
  coverImageUrl?: string | null;

  // Presentacion corta visible en el perfil publico; cadena vacia la borra
  @IsOptional()
  @IsString()
  @MaxLength(300)
  bio?: string;

  /**
   * Teléfono del usuario: privado y editable según requerimiento del MVP
   */
  @IsOptional()
  @IsString()
  @MaxLength(25)
  phone?: string;
}
