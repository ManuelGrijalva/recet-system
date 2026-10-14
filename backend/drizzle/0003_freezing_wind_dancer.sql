CREATE TYPE "public"."contributor_request_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TABLE "contributor_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"motivation" text,
	"status" "contributor_request_status" DEFAULT 'PENDING' NOT NULL,
	"review_notes" text,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contributor_requests" ADD CONSTRAINT "contributor_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contributor_requests" ADD CONSTRAINT "contributor_requests_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "contributor_requests_status_created_idx" ON "contributor_requests" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "contributor_requests_user_id_idx" ON "contributor_requests" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "contributor_requests_one_pending_idx" ON "contributor_requests" USING btree ("user_id") WHERE "contributor_requests"."status" = 'PENDING';