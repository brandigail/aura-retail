import type { Metadata } from "next";
import { WishlistView } from "@/features/wishlist/wishlist-view";

export const metadata: Metadata = { title: "Your wishlist", description: "Products you have saved for later." };

export default function WishlistPage() {
  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
      <h1 className="text-4xl font-extrabold tracking-tight">Your wishlist</h1>
      <p className="mt-2 text-lg text-muted">Products you have saved for later.</p>
      <div className="mt-8">
        <WishlistView />
      </div>
    </div>
  );
}
