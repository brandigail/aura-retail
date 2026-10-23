import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { logout } from "@/features/admin/admin-actions";
import { requireAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Admin | Aura Retail", robots: { index: false, follow: false } };

/** Reads the session cookie, so it must render inside <Suspense>. */
async function AdminGate({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <nav aria-label="Admin" className="flex items-center gap-4 font-medium">
          <Link href="/admin" className="text-accent hover:underline">
            Dashboard
          </Link>
          <Link href="/admin/products" className="text-muted hover:text-foreground hover:underline">
            Products
          </Link>
          <Link href="/" className="text-muted hover:text-foreground hover:underline">
            View store
          </Link>
        </nav>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Sign out
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div aria-busy="true" aria-label="Loading admin" className="mx-auto h-64 w-full max-w-6xl animate-pulse rounded-lg bg-surface" />}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}
