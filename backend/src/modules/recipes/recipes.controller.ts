import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RecipesService, FeedRecipeItem, RecipeDetailItem } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { SearchRecipesDto } from './dto/search-recipe.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CONTRIBUTOR', 'ADMIN')
  async createRecipe(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateRecipeDto,
  ): Promise<FeedRecipeItem> {
    return this.recipesService.create(user.id, user.role, dto);
  }

  @Get('feed')
  async getFeed(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<{ items: FeedRecipeItem[]; total: number }> {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.recipesService.getFeed(pageNum, limitNum);
  }

  @Get('search')
  async searchRecipes(
    @Query() query: SearchRecipesDto,
  ): Promise<FeedRecipeItem[]> {
    return this.recipesService.search(query);
  }

  // Antes de ':id' para que "mine" no se interprete como id
  @Get('mine')
  @UseGuards(JwtAuthGuard)
  async listMyRecipes(@CurrentUser() user: AuthenticatedUser): Promise<FeedRecipeItem[]> {
    return this.recipesService.listMine(user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateRecipe(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateRecipeDto,
  ): Promise<FeedRecipeItem> {
    return this.recipesService.update(id, user, dto);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async getRecipeById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser | null,
  ): Promise<RecipeDetailItem> {
    return this.recipesService.getDetail(id, user ?? undefined);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRecipe(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.recipesService.delete(id, user.id, user.role);
  }
}
