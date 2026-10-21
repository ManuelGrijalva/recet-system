import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { ImageUploadTicket, MediaService } from './media.service';
import { RequestImageUploadDto } from './dto/request-image-upload.dto';
import { RequestProfileImageUploadDto } from './dto/request-profile-image-upload.dto';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  // Mismos roles que pueden publicar recetas
  @Post('recipe-images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CONTRIBUTOR', 'ADMIN')
  async requestRecipeImageUpload(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: RequestImageUploadDto,
  ): Promise<ImageUploadTicket> {
    return this.mediaService.createRecipeImageUpload(user.id, dto);
  }

  // Cualquier usuario con sesion personaliza su perfil
  @Post('profile-images')
  @UseGuards(JwtAuthGuard)
  async requestProfileImageUpload(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: RequestProfileImageUploadDto,
  ): Promise<ImageUploadTicket> {
    return this.mediaService.createProfileImageUpload(user.id, dto);
  }
}
