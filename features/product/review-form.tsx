"use client";

import { Star } from "lucide-react";
import { useActionState, useState } from "react";
import { submitReview } from "./review-actions";
import { initialReviewFormState } from "./review-form-state";
import { REVIEW_LIMITS, type ReviewField } from "./review-validation";

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2.5 text-base placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-[invalid=true]:border-red-600 dark:aria-[invalid=true]:border-red-400";

export function ReviewForm({ productId }: { productId: number }) {
  const [state, formAction, pending] = useActionState(
    submitReview.bind(null, String(productId)),
    initialReviewFormState,
  );
  const { values, errors } = state;
  const [rating, setRating] = useState(0);
  const [seenState, setSeenState] = useState(state);

  // A new server result resets the form fields, so re-sync the star display with what came back.
  if (state !== seenState) {
    setSeenState(state);
    setRating(Number(values.rating) || 0);
  }

  function fieldProps(field: ReviewField) {
    return {
      id: `review-${field}`,
      name: field,
      "aria-invalid": errors[field] ? true : undefined,
      "aria-describedby": errors[field] ? `review-${field}-error` : undefined,
    } as const;
  }

  function error(field: ReviewField) {
    return errors[field] ? (
      <p id={`review-${field}-error`} className="mt-1 text-sm text-red-700 dark:text-red-300">
        {errors[field]}
      </p>
    ) : null;
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4 rounded-lg border border-border p-5">
      <h3 className="text-lg font-semibold">Write a review</h3>

      <fieldset aria-describedby={errors.rating ? "review-rating-error" : undefined}>
        <legend className="mb-1 text-sm font-medium">Your rating</legend>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer rounded focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent">
              <input
                type="radio"
                name="rating"
                value={n}
                defaultChecked={Number(values.rating) === n}
                onChange={() => setRating(n)}
                className="sr-only"
              />
              <span className="sr-only">{n === 1 ? "1 star" : `${n} stars`}</span>
              <Star
                aria-hidden
                className={`size-8 ${n <= rating ? "fill-amber-400 text-amber-400" : "text-muted"}`}
              />
            </label>
          ))}
        </div>
        {error("rating")}
      </fieldset>

      <div>
        <label htmlFor="review-author" className="mb-1 block text-sm font-medium">
          Your name
        </label>
        <input
          {...fieldProps("author")}
          type="text"
          autoComplete="name"
          maxLength={REVIEW_LIMITS.author.max}
          defaultValue={values.author}
          className={inputClass}
        />
        {error("author")}
      </div>

      <div>
        <label htmlFor="review-title" className="mb-1 block text-sm font-medium">
          Review title
        </label>
        <input
          {...fieldProps("title")}
          type="text"
          maxLength={REVIEW_LIMITS.title.max}
          defaultValue={values.title}
          className={inputClass}
        />
        {error("title")}
      </div>

      <div>
        <label htmlFor="review-body" className="mb-1 block text-sm font-medium">
          Your review
        </label>
        <textarea
          {...fieldProps("body")}
          rows={4}
          maxLength={REVIEW_LIMITS.body.max}
          defaultValue={values.body}
          className={inputClass}
        />
        {error("body")}
      </div>

      {/* Honeypot for bots; hidden from people and assistive tech. The odd name keeps browser autofill away from it. */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label htmlFor="review-hp">Leave this empty</label>
        <input id="review-hp" name="review_hp_x3" type="text" tabIndex={-1} autoComplete="off" data-lpignore="true" data-1p-ignore />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-md bg-accent px-6 font-semibold text-accent-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {pending ? "Submitting…" : "Submit review"}
        </button>
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={`text-sm ${state.status === "error" ? "text-red-700 dark:text-red-300" : "text-emerald-700 dark:text-emerald-300"}`}
        >
          {state.message}
        </p>
      </div>
    </form>
  );
}
