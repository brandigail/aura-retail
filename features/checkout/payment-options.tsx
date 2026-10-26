"use client";

import { CreditCard, Landmark } from "lucide-react";
import { useState } from "react";
import type { PaymentMethod } from "@/lib/demo-payment";
import type { CardField, CheckoutFormState } from "./checkout-types";

const INPUT =
  "w-full rounded-md border border-border bg-background px-3 py-2.5 text-base placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-[invalid=true]:border-red-600 dark:aria-[invalid=true]:border-red-400";

interface PaymentOptionsProps {
  method: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  errors: CheckoutFormState["errors"];
  bankDetails: string;
}

/** Groups digits for readability: "4242424242424242" becomes "4242 4242 4242 4242". */
function groupCardNumber(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

export function PaymentOptions({ method, onMethodChange, errors, bankDetails }: PaymentOptionsProps) {
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const option = (id: PaymentMethod, title: string, hint: string, icon: React.ReactNode) => (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
        method === id ? "border-accent bg-accent/5" : "border-border hover:bg-surface"
      }`}
    >
      <input type="radio" name="payment-choice" value={id} checked={method === id} onChange={() => onMethodChange(id)} className="size-4 accent-[#008080]" />
      <span aria-hidden className="text-accent">{icon}</span>
      <span>
        <span className="block font-medium">{title}</span>
        <span className="block text-sm text-muted">{hint}</span>
      </span>
    </label>
  );

  const field = (name: CardField) => ({
    id: name,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  const err = (name: CardField) =>
    errors[name] ? <p id={`${name}-error`} className="mt-1 text-sm text-red-700 dark:text-red-300">{errors[name]}</p> : null;

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-1 text-xl font-semibold">Payment</legend>
      <input type="hidden" name="paymentMethod" value={method} />
      {option("card", "Card", "Visa, Mastercard (demo payment)", <CreditCard className="size-5" />)}
      {option("eft", "Bank transfer (EFT)", "Your order ships once the payment reaches us", <Landmark className="size-5" />)}

      {method === "card" ? (
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4">
          <p className="rounded-md border border-amber-600 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-400 dark:bg-amber-950 dark:text-amber-100">
            <strong>Demo payment.</strong> No real card is charged and real card numbers are refused. Use the test card{" "}
            <button
              type="button"
              onClick={() => {
                setNumber("4242 4242 4242 4242");
                setExpiry("12/34");
                setCvc("123");
              }}
              className="font-mono underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              4242 4242 4242 4242
            </button>{" "}
            (any future expiry, any code). The number 4000 0000 0000 0002 shows a declined payment.
          </p>
          <div>
            <label htmlFor="cardNumber" className="mb-1 block text-sm font-medium">Card number</label>
            <input {...field("cardNumber")} inputMode="numeric" autoComplete="off" placeholder="4242 4242 4242 4242" value={number} onChange={(e) => setNumber(groupCardNumber(e.target.value))} className={`${INPUT} font-mono`} />
            {err("cardNumber")}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="cardExpiry" className="mb-1 block text-sm font-medium">Expiry (MM/YY)</label>
              <input {...field("cardExpiry")} inputMode="numeric" autoComplete="off" placeholder="12/34" value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))} className={`${INPUT} font-mono`} />
              {err("cardExpiry")}
            </div>
            <div>
              <label htmlFor="cardCvc" className="mb-1 block text-sm font-medium">Security code</label>
              <input {...field("cardCvc")} inputMode="numeric" autoComplete="off" placeholder="123" maxLength={4} value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))} className={`${INPUT} font-mono`} />
              {err("cardCvc")}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-surface p-4 text-sm">
          <p className="font-medium">How bank transfer works</p>
          <p className="mt-1 text-muted">
            Place your order, then pay the total by EFT using your order number as the reference. We ship as soon as the money arrives.
          </p>
          {bankDetails && <pre className="mt-3 whitespace-pre-wrap rounded-md bg-background p-3 font-sans">{bankDetails}</pre>}
        </div>
      )}
    </fieldset>
  );
}
