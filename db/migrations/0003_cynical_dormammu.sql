ALTER TABLE "products" ALTER COLUMN "specs" SET DATA TYPE json;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "specs" SET DEFAULT '{}'::json;