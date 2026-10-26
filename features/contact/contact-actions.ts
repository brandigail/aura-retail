"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";

export interface ContactFormState {
  status: "idle" | "ok" | "error";
  message: string;
  errors: Partial<Record<"name" | "email" | "message", string>>;
  values: { name: string; email: string; message: string };
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendContactMessage(_previous: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };

  // Hidden field real visitors never fill in; bots do. Pretend success so they learn nothing.
  if (String(formData.get("website") ?? "") !== "") {
    return { status: "ok", message: "Thanks! Your message has been sent.", errors: {}, values: { name: "", email: "", message: "" } };
  }

  const errors: ContactFormState["errors"] = {};
  if (values.name.length < 2 || values.name.length > 80) errors.name = "Please enter your name.";
  if (!EMAIL.test(values.email) || values.email.length > 120) errors.email = "Please enter a valid email address.";
  if (values.message.length < 10 || values.message.length > 2000) errors.message = "Please write a message of 10 to 2000 characters.";
  if (Object.keys(errors).length > 0) return { status: "error", message: "Please fix the highlighted fields.", errors, values };

  try {
    await db.insert(contactMessages).values(values);
  } catch {
    return { status: "error", message: "We couldn't send your message. Please try again.", errors: {}, values };
  }

  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { status: "ok", message: "Thanks! Your message has been sent. We usually reply within one working day.", errors: {}, values: { name: "", email: "", message: "" } };
}
