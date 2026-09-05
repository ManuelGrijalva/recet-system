import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService, UserPrivateProfile, UserPublicProfile } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

  @Get(':id')
  async getPublicProfile(
    @Param('id') id: string,
  ): Promise<UserPublicProfile> {
    return this.usersService.findPublicById(id);
  }
}
