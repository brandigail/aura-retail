import Link from "next/link";

const linkClass =
  "rounded text-muted hover:text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-accent">Aura Retail</p>
          <p className="text-sm text-muted">Kitchen, toys, crafts, swim gear, home, garden and more.</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <li>
              <Link href="/" className={linkClass}>
                Shop
              </Link>
            </li>
            <li>
              <Link href="/cart" className={linkClass}>
                Cart
              </Link>
            </li>
            <li>
              <Link href="/admin" className={linkClass}>
                Admin
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
