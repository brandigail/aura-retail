import type { ProductField } from "./product-validation";

export interface ProductFormState {
  status: "idle" | "error";
  message: string;
  errors: Partial<Record<ProductField, string>>;
  values: Record<ProductField, string>;
}

export const EMPTY_PRODUCT_VALUES: Record<ProductField, string> = {
  name: "",
  slug: "",
  category: "",
  price: "",
  stock: "0",
  description: "",
  specs: "",
  images: "",
};

export const initialProductFormState: ProductFormState = {
  status: "idle",
  message: "",
  errors: {},
  values: EMPTY_PRODUCT_VALUES,
};
