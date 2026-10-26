import { config } from "dotenv";
import { like } from "drizzle-orm";
import { priceOrder } from "../lib/order-pricing";

config({ path: ".env.local" });

const DEMO_EMAIL_PATTERN = "%@demo.aura-retail.test";
const DAYS = 30;

/** The shop's default prices, used so demo orders carry a realistic breakdown. */
const PRICING = { vatPercent: 15, standardShippingCents: 800, expressShippingCents: 2000, freeShippingOverCents: 10000 } as const;

const CUSTOMERS: readonly { name: string; city: string; street: string }[] = [
  { name: "Thandi Nkosi", city: "Johannesburg, 2196", street: "14 Jan Smuts Avenue, Parkwood" },
  { name: "Pieter van der Merwe", city: "Cape Town, 8001", street: "22 Kloof Street, Gardens" },
  { name: "Aisha Patel", city: "Durban, 4001", street: "8 Florida Road, Morningside" },
  { name: "Liam Botha", city: "Pretoria, 0081", street: "41 Atterbury Road, Menlo Park" },
  { name: "Naledi Dlamini", city: "Bloemfontein, 9301", street: "5 Zastron Street, Westdene" },
  { name: "Sipho Mokoena", city: "Port Elizabeth, 6001", street: "19 Main Road, Walmer" },
  { name: "Emma Fourie", city: "Stellenbosch, 7600", street: "3 Dorp Street" },
  { name: "Kagiso Molefe", city: "Centurion, 0157", street: "77 Lenchen Avenue" },
  { name: "Zanele Khumalo", city: "Pietermaritzburg, 3201", street: "12 Chapel Street" },
  { name: "Ruan Pretorius", city: "George, 6529", street: "30 York Street" },
  { name: "Megan Naidoo", city: "Umhlanga, 4319", street: "9 Lagoon Drive" },
  { name: "Johan Steyn", city: "Nelspruit, 1200", street: "56 Brown Street" },
];

/** Small deterministic generator so every seed run produces the same history. */
function rng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

async function main(): Promise<void> {
  const { db } = await import("./index");
  const { orderItems, orders, products } = await import("./schema");

  const existing = await db.$count(orders, like(orders.email, DEMO_EMAIL_PATTERN));
  if (existing > 0 && !process.argv.includes("--force")) {
    throw new Error(`${existing} demo order(s) already exist. Re-run with --force to replace them (real orders are never touched).`);
  }
  if (existing > 0) await db.delete(orders).where(like(orders.email, DEMO_EMAIL_PATTERN));

  const catalog = await db.select({ id: products.id, name: products.name, price: products.price, discountPercent: products.discountPercent }).from(products);
  if (catalog.length === 0) throw new Error("No products found. Run `npm run seed` first.");

  const rand = rng(20261026);
  const pick = <T,>(list: readonly T[]): T => list[Math.floor(rand() * list.length)];
  const now = Date.now();
  let created = 0;

  for (let day = DAYS - 1; day >= 0; day--) {
    // A few more orders at weekends and towards the end of the month.
    const base = 1 + Math.floor(rand() * 2) + (day < 10 ? 1 : 0);
    for (let n = 0; n < base; n++) {
      const customer = pick(CUSTOMERS);
      const lines = new Map<number, { name: string; unitPrice: number; qty: number }>();
      const lineCount = 1 + Math.floor(rand() * 3);
      for (let i = 0; i < lineCount; i++) {
        const p = pick(catalog);
        const unitPrice = Math.floor((p.price * (100 - p.discountPercent) + 50) / 100);
        lines.set(p.id, { name: p.name, unitPrice, qty: 1 + Math.floor(rand() * 2) });
      }
      const subtotal = [...lines.values()].reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
      const useCode = rand() < 0.2;
      const method = rand() < 0.2 ? "express" : "standard";
      const pricing = priceOrder(PRICING, subtotal, method, useCode ? 10 : 0);
      const byEft = rand() < 0.25;
      const placed = new Date(now - day * 86_400_000 - Math.floor(rand() * 12) * 3_600_000);
      const age = rand();
      const status = day > 7 ? (age < 0.06 ? "cancelled" : "shipped") : day > 2 ? (age < 0.55 ? "shipped" : "paid") : age < 0.7 ? "paid" : "pending";

      const [order] = await db
        .insert(orders)
        .values({
          name: customer.name,
          email: `${customer.name.toLowerCase().replace(/[^a-z]+/g, ".")}@demo.aura-retail.test`,
          address: `${customer.street}\n${customer.city}\nSouth Africa`,
          total: pricing.total,
          subtotal: pricing.subtotal,
          discountCents: pricing.discountCents,
          discountCode: useCode ? "WELCOME10" : null,
          shippingCents: pricing.shippingCents,
          shippingMethod: method,
          vatCents: pricing.vatCents,
          paymentMethod: byEft ? "EFT / bank transfer" : `Card ending ${4000 + Math.floor(rand() * 5000)} (demo)`,
          paymentRef: byEft ? null : `DEMO-${Math.floor(rand() * 0xffffff).toString(16).toUpperCase().padStart(6, "0")}`,
          status,
          createdAt: placed,
        })
        .returning({ id: orders.id });
      await db.insert(orderItems).values([...lines.entries()].map(([productId, l]) => ({ orderId: order.id, productId, ...l })));
      created++;
    }
  }
  console.log(`Inserted ${created} demo orders over the last ${DAYS} days (stock untouched).`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
