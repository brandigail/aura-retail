import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/features/info/info-page";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Privacy policy", description: "What we collect, why, and your rights." };

export default async function PrivacyPage() {
  const s = await getSettings();

  return (
    <InfoPage title="Privacy policy" intro="We only collect what we need to deliver your order and answer your questions.">
      <h2>What we collect</h2>
      <ul>
        <li>Your name, email address and delivery address when you place an order.</li>
        <li>The items you ordered and when you ordered them.</li>
        <li>Your name, email and message when you contact us or leave a review.</li>
        <li>Your cart and wishlist, which stay in your own browser and are not sent to us until you check out.</li>
      </ul>
      <h2>How we use it</h2>
      <ul>
        <li>To process, deliver and support your order, and to send you order emails.</li>
        <li>To answer your messages.</li>
        <li>To meet our tax and accounting obligations.</li>
      </ul>
      <p>We do not sell your information, and we do not use it for advertising.</p>
      <h2>Who sees it</h2>
      <p>
        Only {s.storeName} and the service providers that help us run the shop, such as our delivery couriers and the hosting and database providers that
        keep the website running. They may only use your information to do that job.
      </p>
      <h2>Your rights</h2>
      <p>
        Under the Protection of Personal Information Act (POPIA) you can ask to see, correct or delete the information we hold about you. Email us at{" "}
        <a href={`mailto:${s.contactEmail}`}>{s.contactEmail}</a> or use our <Link href="/contact">contact page</Link>.
      </p>
      <h2>Cookies</h2>
      <p>We use your browser&apos;s storage only to remember your cart, wishlist and light/dark theme choice. We do not use advertising or tracking cookies.</p>
    </InfoPage>
  );
}
