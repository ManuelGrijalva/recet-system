import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { ManagedUser, ModerationService, PendingContributorRequest } from './moderation.service';
import { ReviewContributorRequestDto } from './dto/review-contributor-request.dto';
import { SearchPublishedDto } from './dto/search-published.dto';
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

  @Get('recipes/published')
  async listPublished(@Query() query: SearchPublishedDto): Promise<FeedRecipeItem[]> {
    return this.moderationService.listPublished(query.q);
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

  @Get('contributor-requests')
  async listContributorRequests(): Promise<PendingContributorRequest[]> {
    return this.moderationService.listContributorRequests();
  }

  @Patch('contributor-requests/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async reviewContributorRequest(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() admin: AuthenticatedUser,
    @Body() dto: ReviewContributorRequestDto,
  ): Promise<void> {
    await this.moderationService.reviewContributorRequest(id, admin.id, dto);
  }
}
