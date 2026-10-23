import { Minus, Plus } from "lucide-react";

interface QuantityStepperProps {
  value: number;
  max: number;
  onChange: (next: number) => void;
  /** Appended to the button labels so each stepper is unambiguous, e.g. "quantity of Mouse". */
  subject?: string;
  compact?: boolean;
}

export function QuantityStepper({ value, max, onChange, subject = "quantity", compact = false }: QuantityStepperProps) {
  const size = compact ? "size-9" : "size-12";
  // aria-disabled (not `disabled`) keeps keyboard focus on the button when a limit is reached.
  const button = `inline-flex ${size} items-center justify-center aria-disabled:cursor-not-allowed aria-disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent`;
  const atMin = value <= 1;
  const atMax = value >= max;

  return (
    <div role="group" aria-label={subject} className="inline-flex items-center rounded-md border border-border">
      <button
        type="button"
        aria-label={`Decrease ${subject}`}
        aria-disabled={atMin}
        onClick={() => !atMin && onChange(value - 1)}
        className={button}
      >
        <Minus aria-hidden className="size-4" />
      </button>
      <span aria-live="polite" className={`text-center font-semibold ${compact ? "w-8" : "w-10"}`}>
        {value}
      </span>
      <button
        type="button"
        aria-label={`Increase ${subject}`}
        aria-disabled={atMax}
        onClick={() => !atMax && onChange(value + 1)}
        className={button}
      >
        <Plus aria-hidden className="size-4" />
      </button>
    </div>
  );
}
