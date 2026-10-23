"use client";

import Link from "next/link";
import { useActionState } from "react";
import { initialProductFormState, type ProductFormState } from "./product-form-state";
import { PRODUCT_LIMITS, type ProductField } from "./product-validation";

interface ProductFormProps {
  action: (previous: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  initialValues: Record<ProductField, string>;
  categories: readonly string[];
  submitLabel: string;
}

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2.5 text-base placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-[invalid=true]:border-red-600 dark:aria-[invalid=true]:border-red-400";

export function ProductForm({ action, initialValues, categories, submitLabel }: ProductFormProps) {
  const [state, formAction, pending] = useActionState(action, { ...initialProductFormState, values: initialValues });
  const { values, errors } = state;

  function field(name: ProductField, label: string, control: (props: Record<string, unknown>) => React.ReactNode, hint?: string) {
    const errorId = `product-${name}-error`;
    const hintId = `product-${name}-hint`;
    const describedBy = [errors[name] ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;
    return (
      <div>
        <label htmlFor={`product-${name}`} className="mb-1 block text-sm font-medium">
          {label}
        </label>
        {control({
          id: `product-${name}`,
          name,
          defaultValue: values[name],
          "aria-invalid": errors[name] ? true : undefined,
          "aria-describedby": describedBy,
          className: inputClass,
        })}
        {hint && (
          <p id={hintId} className="mt-1 text-sm text-muted">
            {hint}
          </p>
        )}
        {errors[name] && (
          <p id={errorId} className="mt-1 text-sm text-red-700 dark:text-red-300">
            {errors[name]}
          </p>
        )}
      </div>
    );
  }

  const L = PRODUCT_LIMITS;

  return (
    <form action={formAction} noValidate className="flex max-w-2xl flex-col gap-5">
      {field("name", "Name", (p) => <input {...p} type="text" maxLength={L.name.max} />)}
      {field("slug", "Slug", (p) => <input {...p} type="text" maxLength={L.slug.max} />, "Used in the product's internal name. Leave blank to generate it from the name.")}
      {field(
        "category",
        "Category",
        (p) => (
          <>
            <input {...p} type="text" list="product-categories" maxLength={L.category.max} />
            <datalist id="product-categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </>
        ),
        "Pick an existing category or type a new one.",
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        {field("price", "Price (USD)", (p) => <input {...p} type="text" inputMode="decimal" placeholder="49.99" />)}
        {field("stock", "Stock", (p) => <input {...p} type="text" inputMode="numeric" />)}
      </div>
      {field("description", "Description", (p) => <textarea {...p} rows={4} maxLength={L.description.max} />)}
      {field(
        "specs",
        "Specifications",
        (p) => <textarea {...p} rows={6} placeholder={"Cores: 8\nSocket: AM5"} />,
        "One per line as Name: value.",
      )}
      {field(
        "images",
        "Image paths",
        (p) => <textarea {...p} rows={3} placeholder="/products/my-product/1.webp" />,
        "One local file path per line, under /products/. The first image is the main one. Leave blank to use the placeholder.",
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-md bg-accent px-6 font-semibold text-accent-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        <Link
          href="/admin/products"
          className="rounded-md px-4 py-2.5 font-medium text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Cancel
        </Link>
        <p role={state.status === "error" ? "alert" : "status"} className="text-sm text-red-700 dark:text-red-300">
          {state.status === "error" ? state.message : ""}
        </p>
      </div>
    </form>
  );
}
