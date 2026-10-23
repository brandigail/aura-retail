import { Star } from "lucide-react";
import type { Rating } from "@/types/review";
import type { RatingSummary } from "./rating-summary";

const STARS: Rating[] = [5, 4, 3, 2, 1];

export function RatingBreakdown({ summary }: { summary: RatingSummary }) {
  if (summary.average === null) {
    return <p className="text-muted">No reviews yet. Be the first to review this product.</p>;
  }

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
      <div className="flex flex-col items-center sm:min-w-32">
        <p className="text-5xl font-bold">{summary.average.toFixed(1)}</p>
        <p className="flex" aria-hidden>
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              className={`size-5 ${n <= Math.round(summary.average ?? 0) ? "fill-amber-400 text-amber-400" : "text-border"}`}
            />
          ))}
        </p>
        <p className="mt-1 text-sm text-muted">
          {summary.count} {summary.count === 1 ? "review" : "reviews"}
        </p>
      </div>
      <ul className="flex-1 space-y-1.5" aria-label="Rating breakdown">
        {STARS.map((star) => {
          const count = summary.byStar[star];
          const percent = Math.round((count / summary.count) * 100);
          return (
            <li key={star} className="flex items-center gap-3 text-sm">
              <span className="w-12 shrink-0">{star} star</span>
              <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface" aria-hidden>
                <span className="block h-full rounded-full bg-accent" style={{ width: `${percent}%` }} />
              </span>
              <span className="w-8 shrink-0 text-right text-muted">
                {count}
                <span className="sr-only">
                  {" "}
                  {count === 1 ? "review" : "reviews"}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
