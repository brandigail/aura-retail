export interface TrackFormState {
  status: "idle" | "error" | "found";
  message: string;
  /** Set when found; the order page URL is /orders/<token>. */
  token: string | null;
  values: { orderNumber: string; email: string };
}

export const initialTrackState: TrackFormState = { status: "idle", message: "", token: null, values: { orderNumber: "", email: "" } };
