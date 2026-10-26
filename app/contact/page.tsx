import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/features/contact/contact-form";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Contact us", description: "Questions about an order or a product? Send us a message." };

export default async function ContactPage() {
  const s = await getSettings();

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <h1 className="text-4xl font-extrabold tracking-tight">Contact us</h1>
      <p className="mt-3 text-lg text-muted">Questions about an order or a product? Send us a message and a real person will reply.</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <ContactForm />
        <aside aria-label="Our details" className="flex h-fit flex-col gap-4 rounded-xl border border-border bg-surface p-6">
          <h2 className="text-xl font-bold">Our details</h2>
          <p className="flex items-start gap-3">
            <Mail aria-hidden className="mt-0.5 size-5 shrink-0 text-accent-text" />
            <a href={`mailto:${s.contactEmail}`} className="underline underline-offset-4">{s.contactEmail}</a>
          </p>
          {s.contactPhone && (
            <p className="flex items-start gap-3">
              <Phone aria-hidden className="mt-0.5 size-5 shrink-0 text-accent-text" />
              <a href={`tel:${s.contactPhone.replace(/\s/g, "")}`} className="underline underline-offset-4">{s.contactPhone}</a>
            </p>
          )}
          {s.address && (
            <p className="flex items-start gap-3">
              <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-accent-text" />
              {s.address}
            </p>
          )}
          <p className="flex items-start gap-3 text-muted">
            <Clock aria-hidden className="mt-0.5 size-5 shrink-0 text-accent-text" />
            Monday to Friday, 08:00 to 17:00 (SAST)
          </p>
        </aside>
      </div>
    </div>
  );
}
