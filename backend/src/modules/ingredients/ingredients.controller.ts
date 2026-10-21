import { Controller, Get, Query } from '@nestjs/common';
import {
  CatalogIngredient,
  IngredientCatalogService,
  IngredientResolution,
} from './ingredient-catalog.service';
import { ResolveIngredientsDto } from './dto/resolve-ingredients.dto';

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly catalog: IngredientCatalogService) {}

  // Catalogo publico para los botones rapidos y el autocompletado de la busqueda
  @Get()
  async list(): Promise<CatalogIngredient[]> {
    return this.catalog.listUsed();
  }

  // Explica como se interpreto lo que escribio el usuario
  @Get('resolve')
  async resolve(@Query() query: ResolveIngredientsDto): Promise<IngredientResolution[]> {
    const terms = query.terms
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 20);
    return this.catalog.resolve(terms);
  }
}
