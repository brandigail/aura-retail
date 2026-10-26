import { formatMoney, formatZar } from "@/lib/money";
import type { DailySales } from "@/lib/admin-order-queries";

const DAY = new Intl.DateTimeFormat("en-ZA", { day: "numeric", month: "short", timeZone: "UTC" });

/** Revenue per day as CSS bars; each bar carries its figures in a tooltip and for screen readers. */
export function SalesChart({ daily, zarRate }: { daily: readonly DailySales[]; zarRate: number }) {
  const max = Math.max(...daily.map((d) => d.revenue), 1);
  const first = daily[0];
  const last = daily[daily.length - 1];

  return (
    <figure className="flex flex-col gap-2">
      <figcaption className="sr-only">Revenue per day for the last {daily.length} days</figcaption>
      <ul className="flex h-44 items-end gap-0.5 sm:gap-1" role="list">
        {daily.map((d) => (
          <li
            key={d.day}
            className="group relative flex h-full flex-1 items-end"
            title={`${DAY.format(new Date(d.day))}: ${d.orders} ${d.orders === 1 ? "order" : "orders"}, ${formatMoney(d.revenue)} (${formatZar(d.revenue, zarRate)})`}
          >
            <span
              className={`w-full rounded-t ${d.revenue > 0 ? "bg-accent group-hover:opacity-80" : "bg-surface"}`}
              style={{ height: d.revenue > 0 ? `${Math.max((d.revenue / max) * 100, 4)}%` : "2px" }}
            />
            <span className="sr-only">
              {DAY.format(new Date(d.day))}: {d.orders} orders, {formatMoney(d.revenue)}
            </span>
          </li>
        ))}
      </ul>
      <div aria-hidden className="flex justify-between text-xs text-muted">
        <span>{DAY.format(new Date(first.day))}</span>
        <span>Peak day {formatMoney(max === 1 ? 0 : max)}</span>
        <span>{DAY.format(new Date(last.day))}</span>
      </div>
    </figure>
  );
}
