import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { getSettings } from "@/lib/settings";

// Footer and owner links are not prefetched: each prefetch is a server request, and these pages are rarely the next click.
const linkClass =
  "rounded text-muted hover:text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const SHOP_LINKS = [
  { href: "/", label: "Shop all" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/cart", label: "Cart" },
  { href: "/track", label: "Track your order" },
] as const;

const HELP_LINKS = [
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact" },
  { href: "/shipping-returns", label: "Shipping and returns" },
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of sale" },
] as const;

export async function SiteFooter() {
  const s = await getSettings();

  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <p className="text-lg font-bold text-accent-text">{s.storeName}</p>
          <p className="text-sm text-muted">{s.tagline}</p>
        </div>
        <nav aria-label="Shop" className="flex flex-col gap-2 text-sm">
          <p className="font-semibold">Shop</p>
          <ul className="flex flex-col gap-2">
            {SHOP_LINKS.map(({ href, label }) => (
              <li key={href}><Link href={href} prefetch={false} className={linkClass}>{label}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Help" className="flex flex-col gap-2 text-sm">
          <p className="font-semibold">Help</p>
          <ul className="flex flex-col gap-2">
            {HELP_LINKS.map(({ href, label }) => (
              <li key={href}><Link href={href} prefetch={false} className={linkClass}>{label}</Link></li>
            ))}
          </ul>
        </nav>
        <address className="flex flex-col gap-2 text-sm not-italic text-muted">
          <p className="font-semibold text-foreground">Get in touch</p>
          <a href={`mailto:${s.contactEmail}`} className={`inline-flex items-center gap-2 ${linkClass}`}>
            <Mail aria-hidden className="size-4" />
            {s.contactEmail}
          </a>
          {s.contactPhone && (
            <a href={`tel:${s.contactPhone.replace(/\s/g, "")}`} className={`inline-flex items-center gap-2 ${linkClass}`}>
              <Phone aria-hidden className="size-4" />
              {s.contactPhone}
            </a>
          )}
          {s.address && (
            <p className="inline-flex items-start gap-2">
              <MapPin aria-hidden className="mt-0.5 size-4 shrink-0" />
              {s.address}
            </p>
          )}
        </address>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {s.storeName}. All prices include {s.vatPercent}% VAT.
          </p>
          <Link href="/admin" prefetch={false} className={linkClass}>
            Owner login
          </Link>
        </div>
      </div>
    </footer>
  );
}
