import { Module } from '@nestjs/common';
import { MediaModule } from '../media/media.module';
import { RecipesModule } from '../recipes/recipes.module';
import { InteractionsModule } from '../interactions/interactions.module';
import { ExportsController } from './exports.controller';
import { ExportsService } from './exports.service';
import { RecipePdfService } from './recipe-pdf.service';

@Module({
  imports: [MediaModule, RecipesModule, InteractionsModule],
  controllers: [ExportsController],
  providers: [ExportsService, RecipePdfService],
})
export class ExportsModule {}
