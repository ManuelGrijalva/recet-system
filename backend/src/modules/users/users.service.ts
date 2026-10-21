import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service';
import { recipes, users } from '../../database/schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { MediaService } from '../media/media.service';

export interface UserPrivateProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  phone: string | null;
  bio: string | null;
  coverImageUrl: string | null;
  role: 'USER' | 'CONTRIBUTOR' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPublicProfile {
  id: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  coverImageUrl: string | null;
  role: 'USER' | 'CONTRIBUTOR' | 'ADMIN';
  createdAt: Date;
}

// Perfil publico con su actividad, para la pagina /user/:id
export interface UserPublicProfileView extends UserPublicProfile {
  publishedRecipesCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mediaService: MediaService,
  ) {}

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
        bio: users.bio,
        coverImageUrl: users.coverImageUrl,
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

  async countPublishedRecipes(authorId: string): Promise<number> {
    const [row] = await this.databaseService.db
      .select({ count: sql<number>`count(*)::int` })
      .from(recipes)
      .where(and(eq(recipes.authorId, authorId), eq(recipes.status, 'PUBLISHED')));
    return row?.count ?? 0;
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<UserPrivateProfile> {
    for (const url of [dto.avatarUrl, dto.coverImageUrl]) {
      if (url && !this.mediaService.isOwnProfileImage(url, userId)) {
        throw new BadRequestException('Las fotos del perfil deben subirse desde la página de perfil');
      }
    }

    const [updated] = await this.databaseService.db
      .update(users)
      .set({
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.avatarUrl !== undefined ? { avatarUrl: dto.avatarUrl } : {}),
        ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
        ...(dto.coverImageUrl !== undefined ? { coverImageUrl: dto.coverImageUrl } : {}),
        ...(dto.bio !== undefined ? { bio: dto.bio.trim() || null } : {}),
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
