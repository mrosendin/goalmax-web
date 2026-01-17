CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deviation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"objective_id" uuid NOT NULL,
	"task_id" uuid,
	"ritual_id" uuid,
	"type" text NOT NULL,
	"detected_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp,
	"ai_suggestion" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "metric" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"objective_id" uuid NOT NULL,
	"pillar_id" uuid,
	"name" text NOT NULL,
	"unit" text NOT NULL,
	"type" text DEFAULT 'number' NOT NULL,
	"target" real,
	"target_direction" text,
	"current" real,
	"source" text DEFAULT 'manual' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "metric_entry" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"metric_id" uuid NOT NULL,
	"value" real NOT NULL,
	"note" text,
	"recorded_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "objective" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"description" text,
	"target_outcome" text,
	"start_date" timestamp DEFAULT now() NOT NULL,
	"end_date" timestamp,
	"daily_commitment_minutes" integer DEFAULT 60,
	"status" text DEFAULT 'on_track' NOT NULL,
	"priority" integer DEFAULT 1,
	"is_paused" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pillar" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"objective_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"weight" real DEFAULT 0.25 NOT NULL,
	"progress" real DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ritual" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"objective_id" uuid NOT NULL,
	"pillar_id" uuid,
	"name" text NOT NULL,
	"description" text,
	"frequency" text DEFAULT 'daily' NOT NULL,
	"days_of_week" jsonb,
	"times_per_period" integer DEFAULT 1 NOT NULL,
	"estimated_minutes" integer,
	"current_streak" integer DEFAULT 0 NOT NULL,
	"longest_streak" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ritual_completion" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ritual_id" uuid NOT NULL,
	"completed_at" timestamp DEFAULT now() NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "task" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"objective_id" uuid NOT NULL,
	"pillar_id" uuid,
	"ritual_id" uuid,
	"title" text NOT NULL,
	"description" text,
	"why_it_matters" text,
	"scheduled_at" timestamp NOT NULL,
	"duration_minutes" integer DEFAULT 30 NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"completed_at" timestamp,
	"skipped_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"timezone" text DEFAULT 'America/Los_Angeles',
	"onboarding_completed" boolean DEFAULT false,
	"notification_enabled" boolean DEFAULT true,
	"notification_advance_minutes" integer DEFAULT 5,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "waitlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "waitlist_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deviation" ADD CONSTRAINT "deviation_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deviation" ADD CONSTRAINT "deviation_objective_id_objective_id_fk" FOREIGN KEY ("objective_id") REFERENCES "public"."objective"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deviation" ADD CONSTRAINT "deviation_task_id_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."task"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deviation" ADD CONSTRAINT "deviation_ritual_id_ritual_id_fk" FOREIGN KEY ("ritual_id") REFERENCES "public"."ritual"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metric" ADD CONSTRAINT "metric_objective_id_objective_id_fk" FOREIGN KEY ("objective_id") REFERENCES "public"."objective"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metric" ADD CONSTRAINT "metric_pillar_id_pillar_id_fk" FOREIGN KEY ("pillar_id") REFERENCES "public"."pillar"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metric_entry" ADD CONSTRAINT "metric_entry_metric_id_metric_id_fk" FOREIGN KEY ("metric_id") REFERENCES "public"."metric"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "objective" ADD CONSTRAINT "objective_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pillar" ADD CONSTRAINT "pillar_objective_id_objective_id_fk" FOREIGN KEY ("objective_id") REFERENCES "public"."objective"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ritual" ADD CONSTRAINT "ritual_objective_id_objective_id_fk" FOREIGN KEY ("objective_id") REFERENCES "public"."objective"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ritual" ADD CONSTRAINT "ritual_pillar_id_pillar_id_fk" FOREIGN KEY ("pillar_id") REFERENCES "public"."pillar"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ritual_completion" ADD CONSTRAINT "ritual_completion_ritual_id_ritual_id_fk" FOREIGN KEY ("ritual_id") REFERENCES "public"."ritual"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_objective_id_objective_id_fk" FOREIGN KEY ("objective_id") REFERENCES "public"."objective"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_pillar_id_pillar_id_fk" FOREIGN KEY ("pillar_id") REFERENCES "public"."pillar"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_ritual_id_ritual_id_fk" FOREIGN KEY ("ritual_id") REFERENCES "public"."ritual"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "deviation_user_idx" ON "deviation" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "deviation_objective_idx" ON "deviation" USING btree ("objective_id");--> statement-breakpoint
CREATE INDEX "metric_objective_idx" ON "metric" USING btree ("objective_id");--> statement-breakpoint
CREATE INDEX "metric_entry_metric_idx" ON "metric_entry" USING btree ("metric_id");--> statement-breakpoint
CREATE INDEX "metric_entry_recorded_idx" ON "metric_entry" USING btree ("recorded_at");--> statement-breakpoint
CREATE INDEX "objective_user_idx" ON "objective" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "pillar_objective_idx" ON "pillar" USING btree ("objective_id");--> statement-breakpoint
CREATE INDEX "ritual_objective_idx" ON "ritual" USING btree ("objective_id");--> statement-breakpoint
CREATE INDEX "ritual_completion_ritual_idx" ON "ritual_completion" USING btree ("ritual_id");--> statement-breakpoint
CREATE INDEX "ritual_completion_completed_idx" ON "ritual_completion" USING btree ("completed_at");--> statement-breakpoint
CREATE INDEX "task_user_idx" ON "task" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "task_objective_idx" ON "task" USING btree ("objective_id");--> statement-breakpoint
CREATE INDEX "task_scheduled_idx" ON "task" USING btree ("scheduled_at");