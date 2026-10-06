import { Module } from '@nestjs/common';
import { RecipesModule } from '../recipes/recipes.module';
import { ModerationController } from './moderation.controller';
import { ModerationService } from './moderation.service';

@Module({
  imports: [RecipesModule],
  controllers: [ModerationController],
  providers: [ModerationService],
})
export class ModerationModule {}
