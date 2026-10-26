import Link from "next/link";
import type { ReactNode } from "react";

const SECTIONS = [
  { id: "daily", title: "Your daily routine" },
  { id: "orders", title: "Handling an order" },
  { id: "catalog", title: "Products, stock and photos" },
  { id: "promotions", title: "Sales and discount codes" },
  { id: "settings", title: "Store settings" },
  { id: "email", title: "Customer emails" },
  { id: "money", title: "Prices, VAT and currency" },
  { id: "records", title: "Records for your accountant" },
  { id: "limits", title: "What this version does not do yet" },
] as const;

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24 flex flex-col gap-3">
      <h2 id={`${id}-heading`} className="text-2xl font-bold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

const LINK = "text-accent-text underline underline-offset-4 hover:no-underline";

export default function OwnerGuidePage() {
  return (
    <div className="flex max-w-3xl flex-col gap-10 leading-relaxed">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Owner guide</h1>
        <p className="mt-1 text-muted">Everything you need to run the shop from this screen. You never need a developer for the day-to-day.</p>
      </div>

      <nav aria-label="Guide contents" className="rounded-lg border border-border bg-surface p-5">
        <p className="mb-2 font-semibold">On this page</p>
        <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
          {SECTIONS.map((s) => (
            <li key={s.id}><a href={`#${s.id}`} className={LINK}>{s.title}</a></li>
          ))}
        </ul>
      </nav>

      <Section id="daily" title="Your daily routine">
        <ol className="ml-5 list-decimal space-y-1.5">
          <li>Open the <Link href="/admin" className={LINK}>Dashboard</Link>. It shows sales, VAT, best sellers, low stock and how many orders are waiting for a bank transfer.</li>
          <li>Open <Link href="/admin/orders" className={LINK}>Orders</Link>, pack the paid ones and mark them as shipped.</li>
          <li>Read <Link href="/admin/messages" className={LINK}>Messages</Link> from customers and reply from your own email.</li>
          <li>Check <Link href="/admin/stock" className={LINK}>Stock</Link> for anything running low and top it up.</li>
        </ol>
      </Section>

      <Section id="orders" title="Handling an order">
        <p>Every order moves through simple steps. The customer sees the same steps on their <em>Your orders</em> page.</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li><strong>Paid:</strong> a card payment arrives already paid. Pack it, then press <em>Mark as shipped</em>. The customer is emailed.</li>
          <li><strong>Waiting for payment:</strong> bank transfer (EFT) orders. When the money reaches your account, press <em>Mark as paid</em>, then ship as normal. Customers see your bank details after checkout, set in Settings.</li>
          <li><strong>Cancelled:</strong> pressing <em>Cancel order</em> puts the stock back on the shelf and emails the customer. Cancelled and shipped orders are final.</li>
        </ul>
      </Section>

      <Section id="catalog" title="Products, stock and photos">
        <ul className="ml-5 list-disc space-y-1.5">
          <li><Link href="/admin/products" className={LINK}>Products</Link>: add, edit or remove products. Each product has a name, price, description, specifications and photos.</li>
          <li><strong>Photos:</strong> save the picture into the shop&apos;s <code>public/products</code> folder, then type its path on the product (one per line). Use JPG or WebP, about 1200 by 900 pixels.</li>
          <li><Link href="/admin/stock" className={LINK}>Stock</Link>: <em>Add / remove</em> changes the number by an amount (use a minus to take stock off). <em>Set to</em> replaces it, for example after a stock count.</li>
          <li>Removing a product that customers have open orders for starts a safe process: it is hidden from the shop and those customers are asked to confirm they have seen the notice before it is deleted for good.</li>
        </ul>
      </Section>

      <Section id="promotions" title="Sales and discount codes">
        <ul className="ml-5 list-disc space-y-1.5">
          <li><Link href="/admin/discounts" className={LINK}>Sales</Link> puts products on sale with a percentage off. Tick one product, a whole category or everything, type the percentage and apply. The page previews the new price in dollars and Rands before you save.</li>
          <li><Link href="/admin/codes" className={LINK}>Codes</Link> are what customers type at checkout, like <code>WELCOME10</code>. You can limit how many times a code works and set a last day.</li>
        </ul>
      </Section>

      <Section id="settings" title="Store settings">
        <p>
          <Link href="/admin/settings" className={LINK}>Settings</Link> controls what customers see: your store name, tagline, announcement banner, contact details, delivery prices, the free-delivery
          amount, VAT percentage, bank details and the Rand exchange rate. Changes go live the moment you press Save.
        </p>
      </Section>

      <Section id="email" title="Customer emails">
        <p>
          The shop writes a professional email for every order, shipment, cancellation and &ldquo;find my orders&rdquo; request.
          You can read each one on the <Link href="/admin/emails" className={LINK}>Emails</Link> page.
        </p>
        <p>
          To have them delivered to customers&apos; inboxes, connect a mailbox once. Ask your web developer to add these four settings to the shop&apos;s hosting:
        </p>
        <pre className="overflow-x-auto rounded-md border border-border bg-surface p-4 text-sm">{`SMTP_HOST   (for Gmail: smtp.gmail.com)
SMTP_PORT   (465)
SMTP_USER   (the mailbox, for example orders@yourdomain.co.za)
SMTP_PASS   (the mailbox's app password)`}</pre>
        <p>Until that is done the Emails page says so, and nothing is sent. Messages that could not be delivered show as <em>Failed</em> with the reason, and a <em>Send now</em> button.</p>
      </Section>

      <Section id="money" title="Prices, VAT and currency">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>Prices are stored and charged in <strong>US dollars</strong>. Rand amounts are shown as a guide using the exchange rate in Settings, so update that rate now and then.</li>
          <li>Anyone can switch the whole shop between dollars, Rands or both using the menu at the top. The VAT amount follows that choice, on checkout, receipts and your dashboard.</li>
          <li>Prices <strong>include</strong> VAT. The VAT shown is the part of the price that is VAT, at the percentage in Settings.</li>
        </ul>
      </Section>

      <Section id="records" title="Records for your accountant">
        <p>
          On the <Link href="/admin/orders" className={LINK}>Orders</Link> page, <em>Download CSV</em> gives a spreadsheet of orders with VAT, discounts, delivery and payment details in both dollars and
          Rands. Filter by status or date first, for example one month&apos;s paid and shipped orders. <Link href="/admin/customers" className={LINK}>Customers</Link> lists everyone who has ordered and what they have spent.
        </p>
      </Section>

      <Section id="limits" title="What this version does not do yet">
        <ul className="ml-5 list-disc space-y-1.5">
          <li><strong>Real card payments.</strong> Card payment here is a demonstration and only accepts a test card. To take real payments the shop connects to a payment provider such as PayFast or Stripe. That needs a business account in your name and the provider charges a fee per sale.</li>
          <li><strong>Customer accounts.</strong> Customers see their orders on the device they ordered from, and can find others by email. Logins that work on every device are a planned upgrade.</li>
          <li><strong>Legal pages.</strong> The privacy, terms and returns pages are sensible starting text. Have them checked for your business before you go live.</li>
          <li><strong>Live exchange rate and delivery by country.</strong> The Rand rate is set by hand, and delivery prices are the same everywhere.</li>
        </ul>
      </Section>
    </div>
  );
}
