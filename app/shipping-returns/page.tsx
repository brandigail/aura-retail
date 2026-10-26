import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/features/info/info-page";
import { formatMoney } from "@/lib/money";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Shipping and returns", description: "Delivery options, costs and how returns work." };

export default async function ShippingReturnsPage() {
  const s = await getSettings();

  return (
    <InfoPage title="Shipping and returns" intro="What it costs, how long it takes, and what to do if you change your mind.">
      <h2>Delivery</h2>
      <ul>
        <li>
          <strong>Standard delivery:</strong> {formatMoney(s.standardShippingCents)}, usually 3 to 5 working days.
          {s.freeShippingOverCents > 0 && <> Free on orders of {formatMoney(s.freeShippingOverCents)} or more.</>}
        </li>
        <li>
          <strong>Express delivery:</strong> {formatMoney(s.expressShippingCents)}, usually 1 to 2 working days.
        </li>
      </ul>
      <p>
        Orders placed before 14:00 on a working day are normally packed the same day. You receive an email when your order ships, and you can follow it
        any time on our <Link href="/track">order tracking page</Link>.
      </p>
      <h2>Returns</h2>
      <p>
        You can return most items within 30 days of delivery for a refund, as long as they are unused and in their original packaging. To start a
        return, <Link href="/contact">contact us</Link> with your order number and we will send you the details.
      </p>
      <ul>
        <li>Faulty or wrongly supplied items are collected or refunded at our cost.</li>
        <li>For a change of mind, the return courier cost is for your account.</li>
        <li>Refunds go back to your original payment method within 7 working days of us receiving the item.</li>
        <li>For hygiene reasons, opened pet food, swim caps and personal-care items cannot be returned unless faulty.</li>
      </ul>
      <h2>Your consumer rights</h2>
      <p>Nothing here limits your rights under the Consumer Protection Act, including your right to goods that are of good quality and fit for purpose.</p>
    </InfoPage>
  );
}
