import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  pgEnum,
  uniqueIndex,
  index,
  jsonb,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// 1. ENUMS
// ============================================================================

export const userRoleEnum = pgEnum('user_role', ['USER', 'CONTRIBUTOR', 'ADMIN']);

export const recipeDifficultyEnum = pgEnum('recipe_difficulty', [
  'EASY',
  'MEDIUM',
  'HARD',
]);

export const recipeStatusEnum = pgEnum('recipe_status', [
  'DRAFT',
  'PENDING_REVIEW',
  'PUBLISHED',
  'ARCHIVED',
]);

export const reactionTypeEnum = pgEnum('reaction_type', [
  'LIKE',
  'YUMMY',
  'TRIED_IT',
]);

// ============================================================================
// 2. TYPES AUXILIARES (TIPADO FUERTE SIN ANY)
// ============================================================================

export interface RecipeStepInstruction {
  stepNumber: number;
  instruction: string;
  estimatedMinutes?: number;
}

// ============================================================================
// 3. TABLAS
// ============================================================================

/**
 * Tabla de Usuarios
 * Autenticación vía Google OAuth 2.0 y gestión de perfil.
 * El teléfono es privado y editable por el propio usuario.
 */
export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email').notNull().unique(),
    name: text('name').notNull(),
    avatarUrl: text('avatar_url'),
    phone: text('phone'), // Editable y privado
    role: userRoleEnum('role').default('USER').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('users_email_idx').on(table.email),
    index('users_role_idx').on(table.role),
  ],
);

/**
 * Tabla de Recetas Gastronómicas
 * Soporta metadatos culinarios, tiempos, porciones y ciclo de vida (DRAFT / PUBLISHED).
 */
export const recipes = pgTable(
  'recipes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    authorId: uuid('author_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description').notNull(),
    prepTimeMinutes: integer('prep_time_minutes').notNull().default(0),
    cookTimeMinutes: integer('cook_time_minutes').notNull().default(0),
    servings: integer('servings').notNull().default(1),
    difficulty: recipeDifficultyEnum('difficulty').notNull().default('MEDIUM'),
    coverImageUrl: text('cover_image_url'),
    status: recipeStatusEnum('status').notNull().default('DRAFT'),
    originRegion: text('origin_region').default('Jutiapa').notNull(),
    instructions: jsonb('instructions')
      .$type<RecipeStepInstruction[]>()
      .notNull()
      .default([]),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    // Indice compuesto para el Feed principal: filtra recetas publicadas y ordena por fecha descendente
    index('recipes_feed_status_created_idx').on(table.status, table.createdAt.desc()),
    // Indice para consultar recetas creadas por un usuario en su perfil
    index('recipes_author_id_idx').on(table.authorId),
    // Indice para filtros por region de tradicion culinaria
    index('recipes_origin_region_idx').on(table.originRegion),
    // Indice para clasificacion por dificultad
    index('recipes_difficulty_idx').on(table.difficulty),
  ],
);

/**
 * Catalogo Oficial de Ingredientes (Normalizado)
 * Sustenta la busqueda inteligente por ingredientes segun numeral 3.4.2 de Entrega I part2.md.
 */
export const ingredients = pgTable(
  'ingredients',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull().unique(),
    category: text('category').notNull().default('General'), // ej: Especias, Lacteos, Carnes, Verduras
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('ingredients_name_idx').on(table.name),
    index('ingredients_category_idx').on(table.category),
  ],
);

/**
 * Tabla Pivote: Recetas - Ingredientes (Relacion N:M)
 * Permite calcular porcentaje de coincidencia con ingredientes disponibles.
 */
export const recipeIngredients = pgTable(
  'recipe_ingredients',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade' }),
    ingredientId: uuid('ingredient_id')
      .notNull()
      .references(() => ingredients.id, { onDelete: 'restrict' }),
    quantity: text('quantity').notNull(), // ej: "2", "1/2", "500"
    unit: text('unit').notNull().default('unidades'), // ej: "tazas", "libras", "cucharaditas"
    notes: text('notes'), // ej: "picado fino", "al gusto"
  },
  (table) => [
    // Clave unica para evitar duplicados del mismo ingrediente en una sola receta
    uniqueIndex('recipe_ingredients_recipe_ingredient_unique').on(
      table.recipeId,
      table.ingredientId,
    ),
    // Indice para resolver los ingredientes de una receta dada
    index('recipe_ingredients_recipe_id_idx').on(table.recipeId),
    // Indice clave para el motor de busqueda: localizar recetas a partir de ingredientes disponibles
    index('recipe_ingredients_ingredient_id_idx').on(table.ingredientId),
  ],
);

/**
 * Reacciones a Recetas (LIKE, YUMMY, TRIED_IT)
 * Regla de negocio: Unicidad usuario-receta (maximo una reaccion activa por usuario).
 */
export const recipeReactions = pgTable(
  'recipe_reactions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: reactionTypeEnum('type').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    // Restriccion de unicidad: un usuario solo tiene una reaccion por receta
    uniqueIndex('recipe_reactions_recipe_user_unique').on(
      table.recipeId,
      table.userId,
    ),
    // Indice para agregaciones y conteos de reacciones por tipo
    index('recipe_reactions_recipe_type_idx').on(table.recipeId, table.type),
    index('recipe_reactions_user_id_idx').on(table.userId),
  ],
);

/**
 * Marcadores / Recetario Personal (Bookmarks)
 * Permite a los usuarios guardar recetas en sus colecciones privadas.
 */
export const recipeBookmarks = pgTable(
  'recipe_bookmarks',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    collectionName: text('collection_name').notNull().default('Favoritos'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    // Restriccion de unicidad: un usuario solo guarda una vez la misma receta
    uniqueIndex('recipe_bookmarks_recipe_user_unique').on(
      table.recipeId,
      table.userId,
    ),
    // Indice ordenado para consultar rapidamente los guardados del usuario
    index('recipe_bookmarks_user_created_idx').on(
      table.userId,
      table.createdAt.desc(),
    ),
    index('recipe_bookmarks_recipe_id_idx').on(table.recipeId),
  ],
);

/**
 * Comentarios en Recetas con Soporte para 1 Nivel de Respuestas (Hilos)
 * parent_id nulo representa comentario raiz; con parent_id representa respuesta directa.
 */
export const recipeComments = pgTable(
  'recipe_comments',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    parentId: uuid('parent_id'), // Autorreferencia nullable para hilos de 1 nivel
    content: text('content').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    // Indice para renderizado cronologico de comentarios de una receta
    index('recipe_comments_recipe_created_idx').on(
      table.recipeId,
      table.createdAt.asc(),
    ),
    // Indice para resolver respuestas anidadas a un comentario raiz
    index('recipe_comments_parent_id_idx').on(table.parentId),
    index('recipe_comments_user_id_idx').on(table.userId),
  ],
);

// ============================================================================
// 4. DEFINICION DE RELACIONES DRIZZLE ORM
// ============================================================================

export const usersRelations = relations(users, ({ many }) => ({
  recipes: many(recipes),
  reactions: many(recipeReactions),
  bookmarks: many(recipeBookmarks),
  comments: many(recipeComments),
}));

export const recipesRelations = relations(recipes, ({ one, many }) => ({
  author: one(users, {
    fields: [recipes.authorId],
    references: [users.id],
  }),
  ingredients: many(recipeIngredients),
  reactions: many(recipeReactions),
  bookmarks: many(recipeBookmarks),
  comments: many(recipeComments),
}));

export const ingredientsRelations = relations(ingredients, ({ many }) => ({
  recipeIngredients: many(recipeIngredients),
}));

export const recipeIngredientsRelations = relations(
  recipeIngredients,
  ({ one }) => ({
    recipe: one(recipes, {
      fields: [recipeIngredients.recipeId],
      references: [recipes.id],
    }),
    ingredient: one(ingredients, {
      fields: [recipeIngredients.ingredientId],
      references: [ingredients.id],
    }),
  }),
);

export const recipeReactionsRelations = relations(recipeReactions, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeReactions.recipeId],
    references: [recipes.id],
  }),
  user: one(users, {
    fields: [recipeReactions.userId],
    references: [users.id],
  }),
}));

export const recipeBookmarksRelations = relations(recipeBookmarks, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeBookmarks.recipeId],
    references: [recipes.id],
  }),
  user: one(users, {
    fields: [recipeBookmarks.userId],
    references: [users.id],
  }),
}));

export const recipeCommentsRelations = relations(recipeComments, ({ one, many }) => ({
  recipe: one(recipes, {
    fields: [recipeComments.recipeId],
    references: [recipes.id],
  }),
  user: one(users, {
    fields: [recipeComments.userId],
    references: [users.id],
  }),
  parent: one(recipeComments, {
    fields: [recipeComments.parentId],
    references: [recipeComments.id],
    relationName: 'comment_replies',
  }),
  replies: many(recipeComments, {
    relationName: 'comment_replies',
  }),
}));
