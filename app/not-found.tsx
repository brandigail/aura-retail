import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="text-muted">That page or product doesn&apos;t exist.</p>
      <Link
        href="/"
        className="rounded-md bg-accent px-5 py-2.5 font-semibold text-accent-foreground hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Back to the shop
      </Link>
    </div>
  );
}
