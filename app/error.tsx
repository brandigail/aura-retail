"use client";

import Link from "next/link";

/** Shown when something unexpected goes wrong on a page. The shop's header and footer stay in place around it. */
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="max-w-md text-muted">We couldn&apos;t load this page. It&apos;s not you. Please try again, and if it keeps happening, let us know on the contact page.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-accent px-5 py-2.5 font-semibold text-accent-foreground hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-md border border-border px-5 py-2.5 font-semibold hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Back to the shop
        </Link>
      </div>
    </div>
  );
}
