import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class ReviewContributorRequestDto {
  @IsIn(['APPROVE', 'REJECT'])
  decision!: 'APPROVE' | 'REJECT';

  // Motivo opcional que vera el solicitante si se rechaza
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
