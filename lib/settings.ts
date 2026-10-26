import { eq } from "drizzle-orm";
import { cacheTag } from "next/cache";
import { db } from "@/db";
import { settings } from "@/db/schema";

export interface StoreSettings {
  storeName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  /** Shown in a bar above the header; empty hides it. */
  announcement: string;
  /** Where customers pay by bank transfer (EFT); shown after checkout and in the order email. */
  bankDetails: string;
  vatPercent: number;
  /** Integer cents. */
  standardShippingCents: number;
  expressShippingCents: number;
  /** Orders at or above this subtotal ship free (standard). Integer cents; 0 disables free shipping. */
  freeShippingOverCents: number;
  /** Rands per US dollar, in hundredths (1850 = R18.50). */
  zarPerUsdHundredths: number;
}

const DEFAULTS: StoreSettings = {
  storeName: "Aura Retail",
  tagline: "Everything you need, in one place",
  contactEmail: "hello@example.com",
  contactPhone: "",
  address: "",
  announcement: "",
  bankDetails: "",
  vatPercent: 15,
  standardShippingCents: 800,
  expressShippingCents: 2000,
  freeShippingOverCents: 10000,
  zarPerUsdHundredths: 1850,
};

/** Cached across requests; the admin's save action calls `updateTag("settings")` so edits show immediately. */
export async function getSettings(): Promise<StoreSettings> {
  "use cache";
  cacheTag("settings");

  const [row] = await db.select().from(settings).where(eq(settings.id, 1)).limit(1);
  if (!row) return DEFAULTS;
  return {
    storeName: row.storeName,
    tagline: row.tagline,
    contactEmail: row.contactEmail,
    contactPhone: row.contactPhone,
    address: row.address,
    announcement: row.announcement,
    bankDetails: row.bankDetails,
    vatPercent: row.vatPercent,
    standardShippingCents: row.standardShippingCents,
    expressShippingCents: row.expressShippingCents,
    freeShippingOverCents: row.freeShippingOverCents,
    zarPerUsdHundredths: row.zarPerUsdHundredths,
  };
}

/** Rands per US dollar for display. Customers are always charged in dollars. */
export async function getZarRate(): Promise<number> {
  const { zarPerUsdHundredths } = await getSettings();
  return zarPerUsdHundredths / 100;
}
