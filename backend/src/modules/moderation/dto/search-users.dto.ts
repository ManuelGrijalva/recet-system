import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SearchUsersDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;
}
