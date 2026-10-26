import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/features/info/info-page";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Terms of sale", description: "The terms that apply when you buy from us." };

export default async function TermsPage() {
  const s = await getSettings();

  return (
    <InfoPage title="Terms of sale" intro={`The simple rules for buying from ${s.storeName}.`}>
      <h2>Prices and payment</h2>
      <ul>
        <li>Prices are shown in US dollars and include {s.vatPercent}% VAT. Rand amounts are approximate and for guidance only.</li>
        <li>Delivery is charged separately unless your order qualifies for free delivery.</li>
        <li>We may change prices at any time, but never for an order that has already been confirmed.</li>
      </ul>
      <h2>Your order</h2>
      <ul>
        <li>An order is confirmed when you receive our order confirmation email.</li>
        <li>If an item turns out to be unavailable, we will tell you and refund you in full for it.</li>
        <li>Until an order ships, you can ask us to cancel it by <Link href="/contact">contacting us</Link>.</li>
      </ul>
      <h2>Delivery and returns</h2>
      <p>
        Our <Link href="/shipping-returns">shipping and returns policy</Link> forms part of these terms.
      </p>
      <h2>Reviews</h2>
      <p>Reviews should be honest and respectful. We may remove reviews that are abusive, off-topic or not genuine.</p>
      <h2>Contact</h2>
      <p>
        Questions about these terms? Email <a href={`mailto:${s.contactEmail}`}>{s.contactEmail}</a>.
      </p>
    </InfoPage>
  );
}
