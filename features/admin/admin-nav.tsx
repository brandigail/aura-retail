"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/products", label: "Products", exact: false },
  { href: "/admin/stock", label: "Stock", exact: false },
  { href: "/admin/discounts", label: "Discounts", exact: false },
  { href: "/", label: "View store", exact: true },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="flex flex-wrap items-center gap-x-4 gap-y-1 font-medium">
      {LINKS.map(({ href, label, exact }) => {
        const active = href !== "/" && (exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "border-b-2 border-accent py-1 text-accent"
                : "border-b-2 border-transparent py-1 text-muted hover:text-foreground hover:underline"
            }
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
