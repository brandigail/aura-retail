import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export function EmptyCart({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
      <ShoppingCart aria-hidden className="size-10 text-muted" />
      <p className="text-lg font-semibold">Your cart is empty</p>
      <p className="text-muted">Add some hardware and it will show up here.</p>
      <Link
        href="/"
        onClick={onNavigate}
        className="mt-2 rounded-md bg-accent px-5 py-2.5 font-semibold text-accent-foreground hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Browse products
      </Link>
    </div>
  );
}
