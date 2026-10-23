CREATE TABLE "order_notices" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"product_name" text NOT NULL,
	"kind" text DEFAULT 'product_removed' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"acknowledged_at" timestamp with time zone,
	CONSTRAINT "order_notices_order_product_kind" UNIQUE("order_id","product_id","kind")
);
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "deletion_requested_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "order_notices" ADD CONSTRAINT "order_notices_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "order_notices_order_idx" ON "order_notices" USING btree ("order_id");