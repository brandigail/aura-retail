import type { Rating, Review } from "@/types/review";

export interface RatingSummary {
  average: number | null;
  count: number;
  /** Review count per star, keyed 5 down to 1. */
  byStar: Record<Rating, number>;
}

export function summarizeRatings(items: readonly Pick<Review, "rating">[]): RatingSummary {
  const byStar: Record<Rating, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let total = 0;
  for (const { rating } of items) {
    byStar[rating] += 1;
    total += rating;
  }
  return {
    average: items.length > 0 ? Math.round((total / items.length) * 10) / 10 : null,
    count: items.length,
    byStar,
  };
}
