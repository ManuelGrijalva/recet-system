import { Module } from '@nestjs/common';
import { IngredientsController } from './ingredients.controller';
import { IngredientCatalogService } from './ingredient-catalog.service';

@Module({
  controllers: [IngredientsController],
  providers: [IngredientCatalogService],
  exports: [IngredientCatalogService],
})
export class IngredientsModule {}
