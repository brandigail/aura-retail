"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { SORT_OPTIONS, catalogHref, type CatalogFilters, type SortValue } from "./catalog-params";

const SEARCH_DEBOUNCE_MS = 300;

interface FilterBarProps {
  filters: CatalogFilters;
  categories: readonly string[];
}

export function FilterBar({ filters, categories }: FilterBarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Keep the box in sync with back/forward navigation, but never overwrite what the user is typing.
  useEffect(() => {
    const input = inputRef.current;
    if (input && document.activeElement !== input) input.value = filters.q;
  }, [filters.q]);

  useEffect(() => () => clearTimeout(timer.current), []);

  function navigate(next: CatalogFilters): void {
    router.replace(catalogHref(next), { scroll: false });
  }

  function onSearchChange(value: string): void {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => navigate({ ...filters, q: value.trim() }), SEARCH_DEBOUNCE_MS);
  }

  const pillBase =
    "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
  const pillIdle = "border-border text-foreground hover:bg-surface";
  const pillActive = "border-accent bg-accent text-accent-foreground";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <form
          role="search"
          className="relative flex-1"
          onSubmit={(event) => {
            event.preventDefault();
            clearTimeout(timer.current);
            navigate({ ...filters, q: inputRef.current?.value.trim() ?? "" });
          }}
        >
          <label htmlFor="catalog-search" className="sr-only">
            Search products
          </label>
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted" />
          <input
            ref={inputRef}
            id="catalog-search"
            type="search"
            defaultValue={filters.q}
            maxLength={80}
            placeholder="Search processors, GPUs, SSDs…"
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-11 w-full rounded-md border border-border bg-background pl-10 pr-3 text-base placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </form>
        <div className="flex items-center gap-2">
          <label htmlFor="catalog-sort" className="text-sm text-muted">
            Sort
          </label>
          <select
            id="catalog-sort"
            value={filters.sort}
            onChange={(event) => navigate({ ...filters, sort: event.target.value as SortValue })}
            className="h-11 rounded-md border border-border bg-background px-3 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <nav aria-label="Categories" className="-mx-4 overflow-x-auto px-4 pb-1">
        <ul className="flex gap-2">
          <li>
            <Link
              href={catalogHref({ ...filters, category: null })}
              replace
              scroll={false}
              aria-current={filters.category === null ? "true" : undefined}
              className={`${pillBase} ${filters.category === null ? pillActive : pillIdle} inline-block`}
            >
              All
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category}>
              <Link
                href={catalogHref({ ...filters, category })}
                replace
                scroll={false}
                aria-current={filters.category === category ? "true" : undefined}
                className={`${pillBase} ${filters.category === category ? pillActive : pillIdle} inline-block`}
              >
                {category}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
