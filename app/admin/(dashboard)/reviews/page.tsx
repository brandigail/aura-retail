import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { Suspense } from "react";
import { Star, Trash2 } from "lucide-react";
import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { AdminSkeleton } from "@/features/admin/admin-skeleton";
import { deleteReview } from "@/features/admin/reviews/review-actions";
import { requireAdmin } from "@/lib/admin-auth";

const DATE = new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium", timeZone: "Africa/Johannesburg" });
const SHOWN = 100;

async function Reviews() {
  await requireAdmin();
  const rows = await db
    .select({
      id: reviews.id,
      productId: reviews.productId,
      productName: products.name,
      author: reviews.author,
      rating: reviews.rating,
      title: reviews.title,
      body: reviews.body,
      createdAt: reviews.createdAt,
    })
    .from(reviews)
    .innerJoin(products, eq(products.id, reviews.productId))
    .orderBy(desc(reviews.createdAt), desc(reviews.id))
    .limit(SHOWN);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
        <p className="mt-1 text-muted">Newest first. Remove anything abusive, off-topic or not genuine; it leaves the product page and its star rating straight away.</p>
      </div>
      {rows.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted">No reviews yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((r) => (
            <li key={r.id} className="rounded-lg border border-border p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="flex items-center gap-1 font-semibold">
                    <span className="sr-only">{r.rating} out of 5 stars: </span>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} aria-hidden className={`size-4 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-border"}`} />
                    ))}
                    <span className="ml-2">{r.title}</span>
                  </p>
                  <p className="text-sm text-muted">
                    {r.author} · {DATE.format(r.createdAt)} · on{" "}
                    <Link href={`/products/${r.productId}`} className="text-accent hover:underline">{r.productName}</Link>
                  </p>
                </div>
                <form action={deleteReview.bind(null, r.id, r.productId)}>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm text-red-700 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:text-red-300"
                  >
                    <Trash2 aria-hidden className="size-4" />
                    Remove<span className="sr-only"> review “{r.title}” by {r.author}</span>
                  </button>
                </form>
              </div>
              <p className="mt-3 whitespace-pre-line">{r.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function AdminReviewsPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Reviews />
    </Suspense>
  );
}
