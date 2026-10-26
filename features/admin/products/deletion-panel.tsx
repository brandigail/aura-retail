import { getAffectedOrders } from "@/lib/product-deletion";
import { getSettings } from "@/lib/settings";
import { NotifyCustomerLink } from "./notify-customer-link";
import { cancelDeletion } from "./product-actions";

/** Shows who still has to accept the removal notice. Async: renders inside a Suspense boundary. */
export async function DeletionPanel({ productId, productName }: { productId: number; productName: string }) {
  const [affected, { storeName }] = await Promise.all([getAffectedOrders(productId), getSettings()]);
  const waiting = affected.filter((o) => !o.acknowledged);

  return (
    <div className="mt-2 rounded-md border border-amber-600 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-400 dark:bg-amber-950 dark:text-amber-100">
      <p className="font-medium">
        Pending deletion: {affected.length - waiting.length} of {affected.length} affected customers have accepted the notice.
        {waiting.length === 0 && " You can delete the product now."}
      </p>
      {affected.length > 0 && (
        <ul className="mt-2 space-y-1">
          {affected.map((order) => (
            <li key={order.orderId} className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>
                Order #{order.orderId} · {order.name} · {order.email}
              </span>
              <span className="font-medium">{order.acknowledged ? "Accepted" : "Waiting"}</span>
              {!order.acknowledged && (
                <NotifyCustomerLink
                  email={order.email}
                  customerName={order.name}
                  orderId={order.orderId}
                  token={order.token}
                  productName={productName}
                  storeName={storeName}
                />
              )}
            </li>
          ))}
        </ul>
      )}
      <form action={cancelDeletion.bind(null, productId)} className="mt-3">
        <button
          type="submit"
          className="rounded-md border border-current px-3 py-1.5 text-sm font-medium hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Cancel deletion and put back on sale
        </button>
      </form>
    </div>
  );
}
