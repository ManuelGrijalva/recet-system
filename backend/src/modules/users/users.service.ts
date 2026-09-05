import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service';
import { users } from '../../database/schema';
import { UpdateProfileDto } from './dto/update-profile.dto';

export interface UserPrivateProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  phone: string | null;
  role: 'USER' | 'CONTRIBUTOR' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPublicProfile {
  id: string;
  name: string;
  avatarUrl: string | null;
  role: 'USER' | 'CONTRIBUTOR' | 'ADMIN';
  createdAt: Date;
}

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findPrivateById(id: string): Promise<UserPrivateProfile> {
    const [user] = await this.databaseService.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      throw new NotFoundException('Perfil de usuario no encontrado');
    }

    return user;
  }

  async findPublicById(id: string): Promise<UserPublicProfile> {
    const [user] = await this.databaseService.db
      .select({
        id: users.id,
        name: users.name,
        avatarUrl: users.avatarUrl,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<UserPrivateProfile> {
    const [updated] = await this.databaseService.db
      .update(users)
      .set({
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.avatarUrl !== undefined ? { avatarUrl: dto.avatarUrl } : {}),
        ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    if (!updated) {
      throw new NotFoundException('Usuario no encontrado para actualizar');
    }

    return updated;
  }
}
