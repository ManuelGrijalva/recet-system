import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { MediaModule } from '../media/media.module';
import { IngredientsModule } from '../ingredients/ingredients.module';

@Module({
  imports: [MediaModule, IngredientsModule],
  controllers: [RecipesController],
  providers: [RecipesService],
  exports: [RecipesService],
})
export class RecipesModule {}
