import type { MetadataRoute } from "next";
import { isNull } from "drizzle-orm";
import { connection } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";

const PAGES = ["", "/about", "/contact", "/shipping-returns", "/privacy", "/terms"] as const;

/** Every public page plus every product that is for sale. Built fresh, so new products appear without a redeploy. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const site = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
  const rows = await db.select({ id: products.id, createdAt: products.createdAt }).from(products).where(isNull(products.deletionRequestedAt));

  return [
    ...PAGES.map((path) => ({ url: `${site}${path}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.5 })),
    ...rows.map((p) => ({ url: `${site}/products/${p.id}`, lastModified: p.createdAt, changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}
