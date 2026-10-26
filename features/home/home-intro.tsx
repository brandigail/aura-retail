import Image from "next/image";
import Link from "next/link";
import { ArrowRight, RotateCcw, Receipt, ShieldCheck, Truck } from "lucide-react";
import { ProductCard } from "@/features/catalog/product-card";
import { Money } from "@/components/money";
import { getHomeSections } from "@/lib/home-queries";
import { getSettings } from "@/lib/settings";
import type { ProductSummary } from "@/types/product";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function ProductRow({ id, title, href, linkLabel, items }: { id: string; title: string; href?: string; linkLabel?: string; items: ProductSummary[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id={id} className="text-2xl font-bold tracking-tight">{title}</h2>
        {href && linkLabel && (
          <Link href={href} className={`inline-flex items-center gap-1 rounded text-sm font-medium text-accent-text hover:underline ${FOCUS}`}>
            {linkLabel} <ArrowRight aria-hidden className="size-4" />
          </Link>
        )}
      </div>
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ul>
    </section>
  );
}

/** Hero, trust bar, category tiles and product rows. Shown on the home page only while no filter is active. */
export async function HomeIntro() {
  const [settings, { categories, onSale, topRated }] = await Promise.all([getSettings(), getHomeSections()]);
  const collage = [...onSale, ...topRated].filter((p, i, all) => all.findIndex((q) => q.id === p.id) === i).slice(0, 3);

  const trust = [
    {
      key: "delivery",
      icon: Truck,
      title: settings.freeShippingOverCents > 0 ? <>Free delivery over <Money cents={settings.freeShippingOverCents} /></> : "Fast delivery",
      text: "Tracked, nationwide",
    },
    { key: "secure", icon: ShieldCheck, title: "Secure checkout", text: "Your details stay private" },
    { key: "returns", icon: RotateCcw, title: "30-day returns", text: "Changed your mind? No problem" },
    { key: "vat", icon: Receipt, title: `Prices include ${settings.vatPercent}% VAT`, text: "No surprises at checkout" },
  ];

  return (
    <div className="flex flex-col gap-12">
      <section aria-labelledby="hero-heading" className="overflow-hidden rounded-2xl bg-gradient-to-br from-accent/15 via-surface to-surface">
        <div className="grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col gap-5">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">Welcome to {settings.storeName}</p>
            <h1 id="hero-heading" className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              {settings.tagline}
            </h1>
            <p className="max-w-xl text-lg text-muted">
              Kitchen, toys, crafts, swim gear, home, garden, pets, stationery and tech. Fair prices, honest reviews and delivery to your door.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#shop" className={`inline-flex h-12 items-center gap-2 rounded-md bg-accent px-6 font-semibold text-accent-foreground hover:opacity-90 ${FOCUS}`}>
                Shop now <ArrowRight aria-hidden className="size-5" />
              </a>
              {onSale.length > 0 && (
                <a href="#deals" className={`inline-flex h-12 items-center rounded-md border border-border bg-background px-6 font-semibold hover:bg-surface ${FOCUS}`}>
                  See today&apos;s deals
                </a>
              )}
            </div>
          </div>
          {collage.length > 0 && (
            <ul aria-hidden className="grid grid-cols-3 gap-3">
              {collage.map((p, i) => (
                <li key={p.id} className={`relative aspect-[3/4] overflow-hidden rounded-xl border border-border bg-surface shadow-sm ${i === 1 ? "translate-y-4" : ""}`}>
                  <Image src={p.images[0]} alt="" fill priority sizes="(min-width: 1024px) 15vw, 30vw" className="object-cover" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {trust.map(({ key, icon: Icon, title, text }) => (
          <li key={key} className="flex items-start gap-3 rounded-lg border border-border p-4">
            <Icon aria-hidden className="mt-0.5 size-6 shrink-0 text-accent-text" />
            <div>
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-sm text-muted">{text}</p>
            </div>
          </li>
        ))}
      </ul>

      <section aria-labelledby="categories-heading" className="flex flex-col gap-4">
        <h2 id="categories-heading" className="text-2xl font-bold tracking-tight">Shop by category</h2>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((tile) => (
            <li key={tile.category}>
              <Link
                href={`/?category=${encodeURIComponent(tile.category)}#shop`}
                className={`group relative block aspect-square overflow-hidden rounded-xl border border-border bg-surface ${FOCUS}`}
              >
                <Image src={tile.image} alt="" fill sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3 pt-10 text-white">
                  <span className="block text-sm font-semibold leading-tight">{tile.category}</span>
                  <span className="block text-xs text-white/80">{tile.count} products</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div id="deals" className="scroll-mt-24">
        <ProductRow id="deals-heading" title="On sale now" items={onSale} href="/?sort=price-asc#shop" linkLabel="Browse by price" />
      </div>
      <ProductRow id="top-heading" title="Customer favourites" items={topRated} href="/?sort=rating#shop" linkLabel="All top rated" />
    </div>
  );
}
