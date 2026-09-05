import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InteractionsService, CommentWithAuthor } from './interactions.service';
import { ToggleReactionDto } from './dto/reaction.dto';
import { CreateCommentDto } from './dto/comment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@Controller('interactions')
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  // 1. REACCIONES
  @Post('recipes/:recipeId/reactions')
  @UseGuards(JwtAuthGuard)
  async toggleReaction(
    @Param('recipeId') recipeId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ToggleReactionDto,
  ) {
    return this.interactionsService.toggleReaction(user.id, recipeId, dto.type);
  }

  // 2. GUARDADOS (BOOKMARKS)
  @Post('recipes/:recipeId/bookmarks')
  @UseGuards(JwtAuthGuard)
  async toggleBookmark(
    @Param('recipeId') recipeId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.interactionsService.toggleBookmark(user.id, recipeId);
  }

  @Get('bookmarks')
  @UseGuards(JwtAuthGuard)
  async getMyBookmarks(@CurrentUser() user: AuthenticatedUser) {
    return this.interactionsService.getUserBookmarks(user.id);
  }

  // 3. COMENTARIOS
  @Post('recipes/:recipeId/comments')
  @UseGuards(JwtAuthGuard)
  async addComment(
    @Param('recipeId') recipeId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateCommentDto,
  ): Promise<CommentWithAuthor> {
    return this.interactionsService.addComment(user.id, recipeId, dto);
  }

  @Get('recipes/:recipeId/comments')
  async getRecipeComments(
    @Param('recipeId') recipeId: string,
  ): Promise<CommentWithAuthor[]> {
    return this.interactionsService.getRecipeComments(recipeId);
  }

  @Delete('comments/:commentId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(
    @Param('commentId') commentId: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.interactionsService.deleteComment(commentId, user.id, user.role);
  }
}
