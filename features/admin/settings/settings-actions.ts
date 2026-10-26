"use server";

import { updateTag } from "next/cache";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { dollarsToCents } from "@/lib/money";

export interface SettingsFormState {
  status: "idle" | "ok" | "error";
  message: string;
  errors: Partial<Record<string, string>>;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function saveSettings(_previous: SettingsFormState, formData: FormData): Promise<SettingsFormState> {
  await requireAdmin();

  const errors: Record<string, string> = {};
  const storeName = text(formData, "storeName");
  const tagline = text(formData, "tagline");
  const contactEmail = text(formData, "contactEmail");
  const contactPhone = text(formData, "contactPhone");
  const address = text(formData, "address");
  const announcement = text(formData, "announcement");
  const bankDetails = text(formData, "bankDetails");

  if (storeName.length < 2 || storeName.length > 60) errors.storeName = "Enter a store name of 2 to 60 characters.";
  if (tagline.length > 120) errors.tagline = "Keep the tagline under 120 characters.";
  if (!EMAIL.test(contactEmail)) errors.contactEmail = "Enter a valid email address.";
  if (contactPhone.length > 30) errors.contactPhone = "That phone number is too long.";
  if (address.length > 200) errors.address = "Keep the address under 200 characters.";
  if (bankDetails.length > 500) errors.bankDetails = "Keep the bank details under 500 characters.";
  if (announcement.length > 160) errors.announcement = "Keep the announcement under 160 characters.";

  const vat = Number(text(formData, "vatPercent"));
  if (!Number.isInteger(vat) || vat < 0 || vat > 30) errors.vatPercent = "Enter a whole number from 0 to 30.";

  const standard = dollarsToCents(text(formData, "standardShipping"));
  const express = dollarsToCents(text(formData, "expressShipping"));
  const freeOver = dollarsToCents(text(formData, "freeShippingOver"));
  if (standard === null || standard > 100_000) errors.standardShipping = "Enter an amount like 8.00.";
  if (express === null || express > 100_000) errors.expressShipping = "Enter an amount like 20.00.";
  if (freeOver === null || freeOver > 10_000_000) errors.freeShippingOver = "Enter an amount like 100.00, or 0 for no free shipping.";

  const rate = Number(text(formData, "zarRate"));
  if (!Number.isFinite(rate) || rate < 1 || rate > 100) errors.zarRate = "Enter a rate between 1 and 100, like 18.50.";

  if (Object.keys(errors).length > 0 || standard === null || express === null || freeOver === null) {
    return { status: "error", message: "Please fix the highlighted fields.", errors };
  }

  try {
    const values = {
      storeName,
      tagline,
      contactEmail,
      contactPhone,
      address,
      announcement,
      bankDetails,
      vatPercent: vat,
      standardShippingCents: standard,
      expressShippingCents: express,
      freeShippingOverCents: freeOver,
      zarPerUsdHundredths: Math.round(rate * 100),
      updatedAt: new Date(),
    };
    await db.insert(settings).values({ id: 1, ...values }).onConflictDoUpdate({ target: settings.id, set: values });
  } catch {
    return { status: "error", message: "We couldn't save your settings. Please try again.", errors: {} };
  }

  updateTag("settings");
  return { status: "ok", message: "Settings saved. Your store has been updated.", errors: {} };
}
