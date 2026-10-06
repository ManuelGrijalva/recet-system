import { IsIn } from 'class-validator';

export class UpdateUserRoleDto {
  // ADMIN no se asigna por API (Tabla 50: el admin solo otorga el rol de colaborador)
  @IsIn(['USER', 'CONTRIBUTOR'])
  role!: 'USER' | 'CONTRIBUTOR';
}
