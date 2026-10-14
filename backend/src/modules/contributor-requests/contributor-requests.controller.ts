import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import {
  ContributorRequestItem,
  ContributorRequestsService,
} from './contributor-requests.service';
import { CreateContributorRequestDto } from './dto/create-contributor-request.dto';

@Controller('contributor-requests')
@UseGuards(JwtAuthGuard)
export class ContributorRequestsController {
  constructor(private readonly contributorRequestsService: ContributorRequestsService) {}

  // Envuelto en objeto para no responder un cuerpo vacio cuando no hay solicitud
  @Get('mine')
  async getMine(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ request: ContributorRequestItem | null }> {
    return { request: await this.contributorRequestsService.findLatest(user.id) };
  }

  @Post()
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateContributorRequestDto,
  ): Promise<ContributorRequestItem> {
    return this.contributorRequestsService.create(user, dto);
  }
}
