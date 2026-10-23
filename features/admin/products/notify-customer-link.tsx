"use client";

interface NotifyCustomerLinkProps {
  email: string;
  customerName: string;
  orderId: number;
  token: string;
  productName: string;
}

/**
 * Opens the admin's own mail client with the message and the customer's order link filled in,
 * so the notice can be emailed without a mail service. The link needs the site origin, known only in the browser.
 */
export function NotifyCustomerLink({ email, customerName, orderId, token, productName }: NotifyCustomerLinkProps) {
  function openMail(event: React.MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault();
    const link = `${window.location.origin}/orders/${token}`;
    const subject = `Update about your Aura Retail order #${orderId}`;
    const body = [
      `Hi ${customerName},`,
      "",
      `"${productName}" from your order #${orderId} is being discontinued and removed from our store.`,
      "Your order details stay on record. Please open your order page and confirm you have seen this notice:",
      link,
      "",
      "Thank you,",
      "Aura Retail",
    ].join("\n");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <a
      href={`mailto:${email}`}
      onClick={openMail}
      className="rounded text-accent underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      Email customer<span className="sr-only"> for order {orderId}</span>
    </a>
  );
}
