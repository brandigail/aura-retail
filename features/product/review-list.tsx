import { Star } from "lucide-react";
import type { Review } from "@/types/review";

// Fixed locale and zone so output never depends on the server's settings.
const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" });

export function ReviewList({ reviews }: { reviews: readonly Review[] }) {
  if (reviews.length === 0) return null;

  return (
    <ul className="divide-y divide-border">
      {reviews.map((review) => (
        <li key={review.id} className="py-5 first:pt-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="flex" role="img" aria-label={`${review.rating} out of 5 stars`}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  aria-hidden
                  className={`size-4 ${n <= review.rating ? "fill-amber-400 text-amber-400" : "text-border"}`}
                />
              ))}
            </p>
            <h3 className="font-semibold">{review.title}</h3>
          </div>
          <p className="mt-2">{review.body}</p>
          <p className="mt-2 text-sm text-muted">
            {review.author} ·{" "}
            <time dateTime={review.createdAt}>{dateFormat.format(new Date(review.createdAt))}</time>
          </p>
        </li>
      ))}
    </ul>
  );
}
