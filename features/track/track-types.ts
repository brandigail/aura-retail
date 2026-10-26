export interface TrackFormState {
  status: "idle" | "error" | "found";
  message: string;
  /** Set when found; the order page URL is /orders/<token>. */
  token: string | null;
  values: { orderNumber: string; email: string };
}

export const initialTrackState: TrackFormState = { status: "idle", message: "", token: null, values: { orderNumber: "", email: "" } };

export interface LookupFormState {
  status: "idle" | "sent" | "error";
  message: string;
  email: string;
  /** True when a mail provider is connected, so the page may say the email was really sent. */
  delivered: boolean;
}

export const initialLookupState: LookupFormState = { status: "idle", message: "", email: "", delivered: false };
