import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service';
import { recipes } from '../../database/schema';
import { FeedRecipeItem, RecipesService } from '../recipes/recipes.service';
import { ReviewRecipeDto } from './dto/review-recipe.dto';

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
}
