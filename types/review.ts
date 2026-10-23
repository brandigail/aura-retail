export type Rating = 1 | 2 | 3 | 4 | 5;

export interface Review {
  id: number;
  productId: number;
  author: string;
  rating: Rating;
  title: string;
  body: string;
  /** ISO 8601 string, so it survives the server/client boundary. */
  createdAt: string;
}
