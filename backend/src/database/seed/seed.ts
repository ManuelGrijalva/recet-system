import { config as loadEnvFile } from 'dotenv';
import { and, eq, inArray } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../schema';
import { ingredients, recipeIngredients, recipes, users } from '../schema';
import { SeedAuthorKey, seedAuthors, seedRecipes } from './seed-data';

// Corre fuera de Nest, igual que drizzle.config.ts: carga y valida el .env por su cuenta
loadEnvFile({ path: '.env.local' });
loadEnvFile({ path: '.env' });

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value.trim() === '') {
    throw new Error(`Falta la variable de entorno obligatoria ${name}. Complete backend/.env.`);
  }
  return value;
}

function assertNoDuplicateIngredients(): void {
  for (const recipe of seedRecipes) {
    const names = recipe.ingredients.map((i) => i.name.trim().toLowerCase());
    const duplicated = names.find((name, index) => names.indexOf(name) !== index);
    if (duplicated) {
      throw new Error(`"${recipe.title}" repite el ingrediente "${duplicated}".`);
    }
  }
}

async function main(): Promise<void> {
  assertNoDuplicateIngredients();

  const client = postgres(requireEnv('DATABASE_URL'), {
    ssl: requireEnv('DATABASE_SSL') === 'true' ? 'require' : false,
    max: 1,
  });
  const db = drizzle(client, { schema });

  try {
    // Autores de demostracion: se crean o actualizan por correo
    const authorIds = new Map<SeedAuthorKey, string>();
    for (const author of seedAuthors) {
      const [row] = await db
        .insert(users)
        .values({ email: author.email, name: author.name, role: 'CONTRIBUTOR' })
        .onConflictDoUpdate({
          target: users.email,
          set: { name: author.name, role: 'CONTRIBUTOR', updatedAt: new Date() },
        })
        .returning({ id: users.id });
      authorIds.set(author.key, row.id);
    }

    const ingredientIds = new Map<string, string>();
    async function resolveIngredient(rawName: string): Promise<string> {
      const name = rawName.trim().toLowerCase();
      const cached = ingredientIds.get(name);
      if (cached) return cached;

      const [row] = await db
        .insert(ingredients)
        .values({ name })
        .onConflictDoUpdate({ target: ingredients.name, set: { name } })
        .returning({ id: ingredients.id });
      ingredientIds.set(name, row.id);
      return row.id;
    }

    let created = 0;
    for (const recipe of seedRecipes) {
      const authorId = authorIds.get(recipe.author);
      if (!authorId) throw new Error(`Autor desconocido: ${recipe.author}`);

      // Idempotente: reemplaza la receta del mismo titulo creada por un autor de demostracion
      await db
        .delete(recipes)
        .where(
          and(eq(recipes.title, recipe.title), inArray(recipes.authorId, [...authorIds.values()])),
        );

      const [inserted] = await db
        .insert(recipes)
        .values({
          authorId,
          title: recipe.title,
          description: recipe.description,
          prepTimeMinutes: recipe.prepTimeMinutes,
          cookTimeMinutes: recipe.cookTimeMinutes,
          servings: recipe.servings,
          difficulty: recipe.difficulty,
          status: 'PUBLISHED',
          originRegion: recipe.originRegion,
          sourceType: 'REFERENCE',
          sourceName: recipe.sourceName,
          sourceUrl: recipe.sourceUrl,
          instructions: recipe.steps.map((instruction, index) => ({
            stepNumber: index + 1,
            instruction,
          })),
        })
        .returning({ id: recipes.id });

      for (const ingredient of recipe.ingredients) {
        await db.insert(recipeIngredients).values({
          recipeId: inserted.id,
          ingredientId: await resolveIngredient(ingredient.name),
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          notes: ingredient.notes,
        });
      }
      created += 1;
    }

    console.info(
      `Seed completo: ${created} recetas, ${seedAuthors.length} autores de demostración, ${ingredientIds.size} ingredientes.`,
    );
  } finally {
    await client.end();
  }
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
