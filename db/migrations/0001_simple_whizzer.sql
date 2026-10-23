ALTER TABLE "orders" ADD COLUMN "token" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "address" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_token_unique" UNIQUE("token");