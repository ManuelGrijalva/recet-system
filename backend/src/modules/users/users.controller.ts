import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService, UserPrivateProfile, UserPublicProfileView } from './users.service';
import { FollowsService } from '../follows/follows.service';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly followsService: FollowsService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UserPrivateProfile> {
    return this.usersService.findPrivateById(user.id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateMyProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserPrivateProfile> {
    return this.usersService.updateProfile(user.id, dto);
  }

  // Publico; con sesion indica ademas si quien consulta ya lo sigue
  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async getPublicProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() viewer: AuthenticatedUser | null,
  ): Promise<UserPublicProfileView> {
    const profile = await this.usersService.findPublicById(id);
    const [publishedRecipesCount, counts, isFollowing] = await Promise.all([
      this.usersService.countPublishedRecipes(id),
      this.followsService.counts(id),
      viewer && viewer.id !== id ? this.followsService.isFollowing(viewer.id, id) : Promise.resolve(false),
    ]);
    return { ...profile, publishedRecipesCount, ...counts, isFollowing };
  }
}
