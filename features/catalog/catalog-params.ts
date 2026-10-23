export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
  { value: "name", label: "Name: A to Z" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export interface CatalogFilters {
  category: string | null;
  q: string;
  sort: SortValue;
}

type RawParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

function isSort(value: string): value is SortValue {
  return SORT_OPTIONS.some((option) => option.value === value);
}

/** Turns untrusted query-string values into validated filters. */
export function parseCatalogParams(raw: RawParams, categories: readonly string[]): CatalogFilters {
  const category = first(raw.category);
  const sort = first(raw.sort);
  return {
    category: categories.includes(category) ? category : null,
    q: first(raw.q).trim().slice(0, 80),
    sort: isSort(sort) ? sort : "featured",
  };
}

/** Builds a catalog URL, omitting defaults to keep links short. */
export function catalogHref(filters: CatalogFilters): string {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.q) params.set("q", filters.q);
  if (filters.sort !== "featured") params.set("sort", filters.sort);
  const query = params.toString();
  return query ? `/?${query}` : "/";
}
