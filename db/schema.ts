import {
  check,
  index,
  integer,
  json,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    category: text("category").notNull(),
    /** Integer cents. */
    price: integer("price").notNull(),
    stock: integer("stock").notNull().default(0),
    description: text("description").notNull().default(""),
    // json, not jsonb: jsonb reorders keys, and specs are shown in the order they were written.
    specs: json("specs").$type<Record<string, string>>().notNull().default({}),
    images: jsonb("images").$type<string[]>().notNull().default([]),
    /** Set when the admin starts deleting a product that has open orders. Hides it and blocks new orders. */
    deletionRequestedAt: timestamp("deletion_requested_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("products_category_idx").on(t.category),
    check("products_price_nonneg", sql`${t.price} >= 0`),
    check("products_stock_nonneg", sql`${t.stock} >= 0`),
  ],
);

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    author: text("author").notNull(),
    rating: integer("rating").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("reviews_product_idx").on(t.productId),
    check("reviews_rating_range", sql`${t.rating} between 1 and 5`),
  ],
);

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  /** Unguessable handle for the public confirmation page, so order ids can't be enumerated. */
  token: uuid("token").notNull().unique().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  address: text("address").notNull(),
  /** Integer cents. */
  total: integer("total").notNull(),
  status: text("status", { enum: ["pending", "paid", "shipped", "cancelled"] })
    .notNull()
    .default("paid"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orderItems = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    /** Kept as a plain id (no FK) so deleting a product never rewrites order history. */
    productId: integer("product_id").notNull(),
    name: text("name").notNull(),
    /** Integer cents, snapshotted at purchase time. */
    unitPrice: integer("unit_price").notNull(),
    qty: integer("qty").notNull(),
  },
  (t) => [
    index("order_items_order_idx").on(t.orderId),
    check("order_items_qty_positive", sql`${t.qty} > 0`),
  ],
);

/** A message to a customer about an open order, e.g. that a product in it is being removed. */
export const orderNotices = pgTable(
  "order_notices",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    /** Plain id (no FK): the notice must outlive the product it is about. */
    productId: integer("product_id").notNull(),
    productName: text("product_name").notNull(),
    kind: text("kind", { enum: ["product_removed"] }).notNull().default("product_removed"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    acknowledgedAt: timestamp("acknowledged_at", { withTimezone: true }),
  },
  (t) => [
    index("order_notices_order_idx").on(t.orderId),
    unique("order_notices_order_product_kind").on(t.orderId, t.productId, t.kind),
  ],
);
