"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

export const NAV_LINKS = [
  { href: "/", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/track", label: "Track order" },
] as const;

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

interface NavListProps {
  /** Current path, or null while it isn't known yet (no link is highlighted). */
  pathname: string | null;
  layout: "bar" | "stack";
  onNavigate?: () => void;
}

function NavList({ pathname, layout, onNavigate }: NavListProps) {
  return (
    <ul className={layout === "bar" ? "flex items-center gap-1" : "flex flex-col"}>
      {NAV_LINKS.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`block rounded px-2 font-medium ${layout === "stack" ? "py-2.5" : "py-1.5"} ${FOCUS} ${active ? "text-accent" : "text-muted hover:text-foreground"}`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function ActiveNavList(props: Omit<NavListProps, "pathname">) {
  return <NavList pathname={usePathname()} {...props} />;
}

/** Reading the URL has to wait for the request, so only the links suspend; the rest of the header renders immediately. */
export function SiteNav(props: Omit<NavListProps, "pathname">) {
  return (
    <Suspense fallback={<NavList pathname={null} {...props} />}>
      <ActiveNavList {...props} />
    </Suspense>
  );
}
