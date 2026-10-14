import { Equals, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateContributorRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  motivation?: string;

  // Constancia de que leyó las normas de contenido
  @Equals(true, { message: 'Debes aceptar las normas de contenido para enviar la solicitud' })
  acceptedGuidelines!: boolean;
}
