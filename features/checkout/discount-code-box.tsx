"use client";

import { Tag, X } from "lucide-react";
import { useState, useTransition } from "react";
import { previewDiscountCode } from "./discount-actions";

export interface AppliedDiscount {
  code: string;
  percent: number;
}

interface DiscountCodeBoxProps {
  applied: AppliedDiscount | null;
  onChange: (discount: AppliedDiscount | null) => void;
}

export function DiscountCodeBox({ applied, onChange }: DiscountCodeBoxProps) {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function apply(): void {
    setMessage("");
    startTransition(async () => {
      const result = await previewDiscountCode(value);
      if (result.ok) {
        onChange({ code: result.code, percent: result.percent });
        setValue("");
      } else {
        setMessage(result.message);
      }
    });
  }

  if (applied) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-md border border-accent bg-accent/5 px-3 py-2 text-sm">
        <span className="inline-flex items-center gap-2 font-medium">
          <Tag aria-hidden className="size-4 text-accent-text" />
          {applied.code} <span className="text-muted">({applied.percent}% off)</span>
        </span>
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-label={`Remove code ${applied.code}`}
          className="rounded p-1 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <X aria-hidden className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="discount-code" className="text-sm font-medium">Discount code</label>
      <div className="flex gap-2">
        <input
          id="discount-code"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              if (value.trim()) apply();
            }
          }}
          autoComplete="off"
          autoCapitalize="characters"
          maxLength={40}
          className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 uppercase placeholder:normal-case placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          placeholder="Enter code"
          aria-describedby={message ? "discount-message" : undefined}
        />
        <button
          type="button"
          onClick={apply}
          disabled={pending || value.trim() === ""}
          className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-surface disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {pending ? "Checking…" : "Apply"}
        </button>
      </div>
      {message && <p id="discount-message" role="alert" className="text-sm text-red-700 dark:text-red-300">{message}</p>}
    </div>
  );
}
