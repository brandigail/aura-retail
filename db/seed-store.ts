import { config } from "dotenv";

config({ path: ".env.local" });

/** Inserts the settings row and starter discount codes. Safe to re-run: existing rows are left alone. */
async function main(): Promise<void> {
  const { db } = await import("./index");
  const { discountCodes, settings } = await import("./schema");

  await db
    .insert(settings)
    .values({
      id: 1,
      storeName: "Aura Retail",
      tagline: "Everything you need, in one place",
      contactEmail: "hello@aura-retail.example",
      contactPhone: "+27 21 555 0142",
      address: "12 Long Street, Cape Town, 8001, South Africa",
      announcement: "Free delivery on orders over $100. Use code WELCOME10 for 10% off your first order.",
    })
    .onConflictDoNothing();

  await db
    .insert(discountCodes)
    .values([
      { code: "WELCOME10", percent: 10 },
      { code: "SUMMER20", percent: 20, maxUses: 100 },
    ])
    .onConflictDoNothing();

  console.log("Store settings and starter discount codes are in place.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
