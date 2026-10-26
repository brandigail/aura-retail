import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/features/info/info-page";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "About us", description: "Who we are and how we run the shop." };

export default async function AboutPage() {
  const s = await getSettings();

  return (
    <InfoPage title={`About ${s.storeName}`} intro={s.tagline}>
      <p>
        {s.storeName} is an independent online shop. We started with a simple idea: a good everyday product shouldn&apos;t be hard to find or
        expensive to own. So we bring together useful things for the kitchen, the kids, the garden, the pool, the home office and the pets, all in
        one place.
      </p>
      <h2>How we choose what we sell</h2>
      <ul>
        <li>We pick products we would happily use ourselves.</li>
        <li>We show real photos, honest specifications and genuine customer reviews.</li>
        <li>We keep prices fair and include VAT, so the price you see is the price you pay.</li>
        <li>We tell you plainly how much stock is left, so you are never surprised.</li>
      </ul>
      <h2>Looking after you</h2>
      <p>
        Orders are packed with care and sent with tracking. If something isn&apos;t right, our <Link href="/shipping-returns">returns policy</Link> keeps it
        simple, and a real person answers every message sent through our <Link href="/contact">contact page</Link>.
      </p>
      {s.address && (
        <>
          <h2>Find us</h2>
          <p>{s.address}</p>
        </>
      )}
    </InfoPage>
  );
}
