import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { FeedRecipeItem } from '../recipes/recipes.service';
import { ManagedUser, ModerationService } from './moderation.service';
import { ReviewRecipeDto } from './dto/review-recipe.dto';
import { SearchUsersDto } from './dto/search-users.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

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

  @Get('users')
  async listUsers(@Query() query: SearchUsersDto): Promise<ManagedUser[]> {
    return this.moderationService.listUsers(query.q);
  }

  @Patch('users/:id/role')
  async updateUserRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserRoleDto,
  ): Promise<ManagedUser> {
    return this.moderationService.updateUserRole(id, dto);
  }
}
