import { IsEnum, IsNotEmpty } from 'class-validator';

export class ToggleReactionDto {
  @IsEnum(['LIKE', 'YUMMY', 'TRIED_IT'])
  @IsNotEmpty()
  type!: 'LIKE' | 'YUMMY' | 'TRIED_IT';
}
