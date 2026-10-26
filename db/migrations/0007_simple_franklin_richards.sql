ALTER TABLE "email_outbox" ADD COLUMN "html" text;--> statement-breakpoint
ALTER TABLE "email_outbox" ADD COLUMN "status" text DEFAULT 'recorded' NOT NULL;--> statement-breakpoint
ALTER TABLE "email_outbox" ADD COLUMN "sent_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "email_outbox" ADD COLUMN "error" text;