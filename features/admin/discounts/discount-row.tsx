import { DualPrice } from "@/features/admin/dual-price";
import { ProductThumb } from "@/features/admin/product-thumb";
import type { AdminProductRow } from "@/lib/admin-product-queries";
import { formatMoney, formatZar, salePrice } from "@/lib/money";

interface DiscountRowProps {
  row: AdminProductRow;
  zarRate: number;
  selected: boolean;
  /** The percentage typed in the bulk bar, when valid. Selected rows preview it before it is saved. */
  previewPercent: number | null;
  onToggle: (id: number) => void;
}

export function DiscountRow({ row, zarRate, selected, previewPercent, onToggle }: DiscountRowProps) {
  const previewing = selected && previewPercent !== null && previewPercent !== row.discountPercent;
  const percent = previewing ? previewPercent : row.discountPercent;
  const newPrice = salePrice(row.price, percent);
  const saving = row.price - newPrice;

  return (
    <tr className={`border-t border-border align-top ${selected ? "bg-accent/5" : ""}`}>
      <td className="px-3 py-3">
        <input
          type="checkbox"
          name="id"
          value={row.id}
          checked={selected}
          onChange={() => onToggle(row.id)}
          aria-label={`Select ${row.name}`}
          className="size-5 accent-[#008080]"
        />
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-3">
          <ProductThumb src={row.image} />
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-muted">{row.category}</p>
          </div>
        </div>
      </td>
      <td className="px-3 py-3 text-right">
        <DualPrice cents={row.price} zarRate={zarRate} className="items-end" />
      </td>
      <td className="px-3 py-3 text-right">{row.discountPercent > 0 ? `${row.discountPercent}%` : <span className="text-muted">None</span>}</td>
      <td className="px-3 py-3 text-right">
        <DualPrice cents={newPrice} zarRate={zarRate} className="items-end" />
        {percent > 0 && (
          <p className="mt-1 text-xs font-medium text-accent">
            {previewing ? `Preview, ${percent}% off: ` : `${percent}% off: `}
            saves {formatMoney(saving)} / {formatZar(saving, zarRate)}
          </p>
        )}
      </td>
    </tr>
  );
}
