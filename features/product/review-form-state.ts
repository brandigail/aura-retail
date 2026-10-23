import type { ReviewErrors, ReviewField } from "./review-validation";

export interface ReviewFormState {
  status: "idle" | "error" | "success";
  message: string;
  errors: ReviewErrors;
  /** Echoed back on error so the form keeps what the user typed. */
  values: Record<ReviewField, string>;
}

export const EMPTY_REVIEW_VALUES: Record<ReviewField, string> = { author: "", rating: "", title: "", body: "" };

export const initialReviewFormState: ReviewFormState = {
  status: "idle",
  message: "",
  errors: {},
  values: EMPTY_REVIEW_VALUES,
};
