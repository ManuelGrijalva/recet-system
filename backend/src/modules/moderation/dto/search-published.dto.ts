import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SearchPublishedDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;
}
