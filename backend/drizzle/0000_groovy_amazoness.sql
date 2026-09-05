CREATE TYPE "public"."reaction_type" AS ENUM('LIKE', 'YUMMY', 'TRIED_IT');--> statement-breakpoint
CREATE TYPE "public"."recipe_difficulty" AS ENUM('EASY', 'MEDIUM', 'HARD');--> statement-breakpoint
CREATE TYPE "public"."recipe_status" AS ENUM('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('USER', 'CONTRIBUTOR', 'ADMIN');--> statement-breakpoint
CREATE TABLE "ingredients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category" text DEFAULT 'General' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ingredients_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "recipe_bookmarks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipe_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"collection_name" text DEFAULT 'Favoritos' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipe_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"parent_id" uuid,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_ingredients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipe_id" uuid NOT NULL,
	"ingredient_id" uuid NOT NULL,
	"quantity" text NOT NULL,
	"unit" text DEFAULT 'unidades' NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "recipe_reactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipe_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "reaction_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"prep_time_minutes" integer DEFAULT 0 NOT NULL,
	"cook_time_minutes" integer DEFAULT 0 NOT NULL,
	"servings" integer DEFAULT 1 NOT NULL,
	"difficulty" "recipe_difficulty" DEFAULT 'MEDIUM' NOT NULL,
	"cover_image_url" text,
	"status" "recipe_status" DEFAULT 'DRAFT' NOT NULL,
	"origin_region" text DEFAULT 'Jutiapa' NOT NULL,
	"instructions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"avatar_url" text,
	"phone" text,
	"role" "user_role" DEFAULT 'USER' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "recipe_bookmarks" ADD CONSTRAINT "recipe_bookmarks_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_bookmarks" ADD CONSTRAINT "recipe_bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_comments" ADD CONSTRAINT "recipe_comments_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_comments" ADD CONSTRAINT "recipe_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_reactions" ADD CONSTRAINT "recipe_reactions_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_reactions" ADD CONSTRAINT "recipe_reactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ingredients_name_idx" ON "ingredients" USING btree ("name");--> statement-breakpoint
CREATE INDEX "ingredients_category_idx" ON "ingredients" USING btree ("category");--> statement-breakpoint
CREATE UNIQUE INDEX "recipe_bookmarks_recipe_user_unique" ON "recipe_bookmarks" USING btree ("recipe_id","user_id");--> statement-breakpoint
CREATE INDEX "recipe_bookmarks_user_created_idx" ON "recipe_bookmarks" USING btree ("user_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "recipe_bookmarks_recipe_id_idx" ON "recipe_bookmarks" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "recipe_comments_recipe_created_idx" ON "recipe_comments" USING btree ("recipe_id","created_at");--> statement-breakpoint
CREATE INDEX "recipe_comments_parent_id_idx" ON "recipe_comments" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "recipe_comments_user_id_idx" ON "recipe_comments" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "recipe_ingredients_recipe_ingredient_unique" ON "recipe_ingredients" USING btree ("recipe_id","ingredient_id");--> statement-breakpoint
CREATE INDEX "recipe_ingredients_recipe_id_idx" ON "recipe_ingredients" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "recipe_ingredients_ingredient_id_idx" ON "recipe_ingredients" USING btree ("ingredient_id");--> statement-breakpoint
CREATE UNIQUE INDEX "recipe_reactions_recipe_user_unique" ON "recipe_reactions" USING btree ("recipe_id","user_id");--> statement-breakpoint
CREATE INDEX "recipe_reactions_recipe_type_idx" ON "recipe_reactions" USING btree ("recipe_id","type");--> statement-breakpoint
CREATE INDEX "recipe_reactions_user_id_idx" ON "recipe_reactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "recipes_feed_status_created_idx" ON "recipes" USING btree ("status","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "recipes_author_id_idx" ON "recipes" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "recipes_origin_region_idx" ON "recipes" USING btree ("origin_region");--> statement-breakpoint
CREATE INDEX "recipes_difficulty_idx" ON "recipes" USING btree ("difficulty");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");