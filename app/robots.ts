import type { MetadataRoute } from "next";

/** Search engines may index the shop, but not the owner's area, carts, orders or personal pages. */
export default function robots(): MetadataRoute.Robots {
  const site = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/orders/", "/checkout", "/cart", "/track", "/wishlist"] }],
    sitemap: `${site}/sitemap.xml`,
  };
}
