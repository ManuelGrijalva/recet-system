CREATE TYPE "public"."recipe_source_type" AS ENUM('REFERENCE', 'INTERVIEW', 'COMMUNITY');--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "source_type" "recipe_source_type" DEFAULT 'COMMUNITY' NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "source_name" text;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "source_url" text;