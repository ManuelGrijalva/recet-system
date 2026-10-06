import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { asc, eq, ilike, or } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service';
import { recipes, users } from '../../database/schema';
import { UserRole } from '../../common/decorators/roles.decorator';
import { FeedRecipeItem, RecipesService } from '../recipes/recipes.service';
import { ReviewRecipeDto } from './dto/review-recipe.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: Date;
}

const managedUserColumns = {
  id: users.id,
  name: users.name,
  email: users.email,
  avatarUrl: users.avatarUrl,
  role: users.role,
  createdAt: users.createdAt,
};

@Injectable()
export class ModerationService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly recipesService: RecipesService,
  ) {}

  async listPending(): Promise<FeedRecipeItem[]> {
    const db = this.databaseService.db;

    // Las mas antiguas primero para revisar en orden de llegada
    const pending = await db
      .select({ id: recipes.id })
      .from(recipes)
      .where(eq(recipes.status, 'PENDING_REVIEW'))
      .orderBy(asc(recipes.createdAt));

    return Promise.all(pending.map((row) => this.recipesService.getById(row.id)));
  }

  async review(recipeId: string, dto: ReviewRecipeDto): Promise<FeedRecipeItem> {
    const db = this.databaseService.db;

    const [recipe] = await db
      .select({ status: recipes.status })
      .from(recipes)
      .where(eq(recipes.id, recipeId))
      .limit(1);

    if (!recipe) {
      throw new NotFoundException('Receta no encontrada');
    }

    if (recipe.status !== 'PENDING_REVIEW') {
      throw new ConflictException('La receta no esta pendiente de revision');
    }

    // Devolver la regresa a borrador con las observaciones para que el autor la corrija
    const approved = dto.decision === 'APPROVE';
    await db
      .update(recipes)
      .set({
        status: approved ? 'PUBLISHED' : 'DRAFT',
        reviewNotes: approved ? null : dto.notes,
        updatedAt: new Date(),
      })
      .where(eq(recipes.id, recipeId));

    return this.recipesService.getById(recipeId);
  }

  async listUsers(q?: string): Promise<ManagedUser[]> {
    const term = q?.trim();

    return this.databaseService.db
      .select(managedUserColumns)
      .from(users)
      .where(
        term
          ? or(ilike(users.name, `%${term}%`), ilike(users.email, `%${term}%`))
          : undefined,
      )
      .orderBy(asc(users.name))
      .limit(50);
  }

  async updateUserRole(userId: string, dto: UpdateUserRoleDto): Promise<ManagedUser> {
    const db = this.databaseService.db;

    const [user] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.role === 'ADMIN') {
      throw new ForbiddenException('No se puede cambiar el rol de un administrador');
    }

    const [updated] = await db
      .update(users)
      .set({ role: dto.role, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning(managedUserColumns);

    return updated;
  }
}
