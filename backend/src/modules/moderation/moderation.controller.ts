import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { FeedRecipeItem } from '../recipes/recipes.service';
import { ModerationService } from './moderation.service';
import { ReviewRecipeDto } from './dto/review-recipe.dto';

@Controller('moderation')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Get('recipes/pending')
  async listPending(): Promise<FeedRecipeItem[]> {
    return this.moderationService.listPending();
  }

  @Patch('recipes/:id')
  async reviewRecipe(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ReviewRecipeDto,
  ): Promise<FeedRecipeItem> {
    return this.moderationService.review(id, dto);
  }
}
