import {
  boolean,
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
    /** Whole-percent sale discount off `price`; 0 means no discount. */
    discountPercent: integer("discount_percent").notNull().default(0),
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
    check("products_discount_range", sql`${t.discountPercent} between 0 and 90`),
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
  /** Integer cents breakdown of `total`: subtotal - discount + shipping. VAT is included in prices and shown separately. */
  subtotal: integer("subtotal").notNull().default(0),
  discountCents: integer("discount_cents").notNull().default(0),
  discountCode: text("discount_code"),
  shippingCents: integer("shipping_cents").notNull().default(0),
  shippingMethod: text("shipping_method"),
  /** VAT contained in `total`, snapshotted at the rate in force when the order was placed. */
  vatCents: integer("vat_cents").notNull().default(0),
  paymentMethod: text("payment_method"),
  paymentRef: text("payment_ref"),
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

/** The shop's single settings row (id = 1), edited by the owner in the admin. */
export const settings = pgTable("settings", {
  id: integer("id").primaryKey().default(1),
  storeName: text("store_name").notNull().default("Aura Retail"),
  tagline: text("tagline").notNull().default("Everything you need, in one place"),
  contactEmail: text("contact_email").notNull().default("hello@example.com"),
  contactPhone: text("contact_phone").notNull().default(""),
  address: text("address").notNull().default(""),
  announcement: text("announcement").notNull().default(""),
  /** Shown to customers who choose bank transfer (EFT). */
  bankDetails: text("bank_details").notNull().default(""),
  vatPercent: integer("vat_percent").notNull().default(15),
  standardShippingCents: integer("standard_shipping_cents").notNull().default(800),
  expressShippingCents: integer("express_shipping_cents").notNull().default(2000),
  freeShippingOverCents: integer("free_shipping_over_cents").notNull().default(10000),
  /** Rands per US dollar, in hundredths (1850 = R18.50). Display only; customers are charged in dollars. */
  zarPerUsdHundredths: integer("zar_per_usd_hundredths").notNull().default(1850),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [check("settings_single_row", sql`${t.id} = 1`)]);

export const discountCodes = pgTable(
  "discount_codes",
  {
    id: serial("id").primaryKey(),
    code: text("code").notNull().unique(),
    percent: integer("percent").notNull(),
    active: boolean("active").notNull().default(true),
    /** Null means unlimited. */
    maxUses: integer("max_uses"),
    usesCount: integer("uses_count").notNull().default(0),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check("discount_codes_percent_range", sql`${t.percent} between 1 and 90`),
    // Makes the database refuse an order that would use a code past its limit, even if two buyers race.
    check("discount_codes_uses_within_max", sql`${t.maxUses} is null or ${t.usesCount} <= ${t.maxUses}`),
  ],
);

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  readAt: timestamp("read_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Every email the shop would send. Delivered by a mail provider once one is connected; always readable here. */
export const emailOutbox = pgTable("email_outbox", {
  id: serial("id").primaryKey(),
  toEmail: text("to_email").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  kind: text("kind", { enum: ["order_confirmation", "order_shipped", "order_cancelled", "order_lookup"] }).notNull(),
  orderId: integer("order_id"),
  /** The designed HTML version; `body` stays as the plain-text version every mail app can show. */
  html: text("html"),
  /** recorded: no mail provider connected, kept here only. sent: handed to the mail provider. failed: the provider refused it. */
  status: text("status", { enum: ["recorded", "sent", "failed"] }).notNull().default("recorded"),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  error: text("error"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
