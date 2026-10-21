import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { InteractionsService } from '../interactions/interactions.service';
import { RecipeDetailItem, RecipesService } from '../recipes/recipes.service';
import { RecipePdfService } from './recipe-pdf.service';

export interface PdfFile {
  fileName: string;
  pdf: Buffer;
}

const COOKBOOK_MAX_RECIPES = 50;

// Nombre de archivo seguro: sin acentos, espacios ni simbolos
function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'receta';
}

@Injectable()
export class ExportsService {
  constructor(
    private readonly recipesService: RecipesService,
    private readonly interactionsService: InteractionsService,
    private readonly recipePdfService: RecipePdfService,
  ) {}

  async recipePdf(recipeId: string, viewer?: AuthenticatedUser): Promise<PdfFile> {
    const recipe = await this.recipesService.getDetail(recipeId, viewer);
    return {
      fileName: `receta-${slugify(recipe.title)}.pdf`,
      pdf: await this.recipePdfService.buildRecipe(recipe),
    };
  }

  async cookbookPdf(user: AuthenticatedUser): Promise<PdfFile> {
    const bookmarks = await this.interactionsService.getUserBookmarks(user.id);

    // Se omiten las guardadas que ya no estan publicadas
    const details = await Promise.all(
      bookmarks.slice(0, COOKBOOK_MAX_RECIPES).map((b) =>
        this.recipesService.getDetail(b.recipe.id, user).catch(() => null),
      ),
    );
    const recipes = details.filter(
      (r): r is RecipeDetailItem => r !== null && r.status === 'PUBLISHED',
    );

    if (recipes.length === 0) {
      throw new NotFoundException('Aún no tienes recetas guardadas para descargar');
    }

    return {
      fileName: `recetario-${slugify(user.name)}.pdf`,
      pdf: await this.recipePdfService.buildCookbook({ name: user.name }, recipes),
    };
  }
}
