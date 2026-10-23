import type { Rating } from "@/types/review";

export const REVIEW_LIMITS = {
  author: { min: 2, max: 60 },
  title: { min: 3, max: 100 },
  body: { min: 10, max: 2000 },
} as const;

export type ReviewField = "author" | "rating" | "title" | "body";

export interface ReviewInput {
  author: string;
  rating: Rating;
  title: string;
  body: string;
}

export type ReviewErrors = Partial<Record<ReviewField, string>>;

export type ReviewValidation =
  | { ok: true; value: ReviewInput }
  | { ok: false; errors: ReviewErrors; values: Record<ReviewField, string> };

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function lengthError(label: string, value: string, min: number, max: number): string | undefined {
  if (value.length < min) return value.length === 0 ? `${label} is required.` : `${label} must be at least ${min} characters.`;
  if (value.length > max) return `${label} must be at most ${max} characters.`;
  return undefined;
}

/** Validates untrusted form data; never trust the client-side `required`/`maxLength` attributes. */
export function validateReview(formData: FormData): ReviewValidation {
  const values: Record<ReviewField, string> = {
    author: text(formData, "author"),
    rating: text(formData, "rating"),
    title: text(formData, "title"),
    body: text(formData, "body"),
  };
  const { author, title, body } = REVIEW_LIMITS;

  const errors: ReviewErrors = {};
  const authorError = lengthError("Name", values.author, author.min, author.max);
  const titleError = lengthError("Title", values.title, title.min, title.max);
  const bodyError = lengthError("Review", values.body, body.min, body.max);
  if (authorError) errors.author = authorError;
  if (titleError) errors.title = titleError;
  if (bodyError) errors.body = bodyError;

  const rating = Number(values.rating);
  const ratingOk = /^[1-5]$/.test(values.rating);
  if (!ratingOk) errors.rating = "Choose a rating from 1 to 5 stars.";

  if (Object.keys(errors).length > 0 || !ratingOk) return { ok: false, errors, values };
  return {
    ok: true,
    value: { author: values.author, rating: rating as Rating, title: values.title, body: values.body },
  };
}
