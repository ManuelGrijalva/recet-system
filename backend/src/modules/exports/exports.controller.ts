import { Controller, Get, Param, ParseUUIDPipe, Res, StreamableFile, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { ExportsService } from './exports.service';

function sendPdf(res: Response, fileName: string, pdf: Buffer): StreamableFile {
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="${fileName}"`,
    'Cache-Control': 'private, no-store',
  });
  return new StreamableFile(pdf);
}

@Controller('exports')
export class ExportsController {
  constructor(private readonly exportsService: ExportsService) {}

  // Publica como la ficha: lo no publicado solo lo descargan su autor y el admin
  @Get('recipes/:id/pdf')
  @UseGuards(OptionalJwtAuthGuard)
  async recipePdf(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser | null,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const { fileName, pdf } = await this.exportsService.recipePdf(id, user ?? undefined);
    return sendPdf(res, fileName, pdf);
  }

  @Get('cookbook/pdf')
  @UseGuards(JwtAuthGuard)
  async cookbookPdf(
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const { fileName, pdf } = await this.exportsService.cookbookPdf(user);
    return sendPdf(res, fileName, pdf);
  }
}
