import nodemailer, { type Transporter } from "nodemailer";

export interface MailMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}

export type SendResult = { ok: true } | { ok: false; error: string };

interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  /** Who the customer sees the email coming from, e.g. `Aura Retail <orders@example.com>`. */
  from: string;
}

/**
 * Reads the mail provider settings from the environment. Any SMTP provider works (Gmail with an app password,
 * the shop's own domain mail, Brevo and so on). Returns null when none is set up, which switches the shop to
 * "record only" mode: emails are still saved in the owner's Emails inbox but nothing leaves the building.
 */
function readConfig(fromName: string): SmtpConfig | null {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!host || !user || !pass) return null;

  const port = Number(process.env.SMTP_PORT) || 465;
  const from = process.env.EMAIL_FROM?.trim() || `${fromName} <${user}>`;
  return { host, port, user, pass, from };
}

/** True when real email delivery is switched on. Shown to customers so the shop never claims an email it did not send. */
export function isEmailConfigured(): boolean {
  return readConfig("") !== null;
}

let cached: { key: string; transport: Transporter } | null = null;

function transportFor(config: SmtpConfig): Transporter {
  const key = `${config.host}:${config.port}:${config.user}`;
  if (cached?.key !== key) {
    cached = {
      key,
      transport: nodemailer.createTransport({
        host: config.host,
        port: config.port,
        // Port 465 is encrypted from the start; the other common ports upgrade the connection after connecting.
        secure: config.port === 465,
        auth: { user: config.user, pass: config.pass },
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 15000,
      }),
    };
  }
  return cached.transport;
}

/** Sends one email. Never throws; the caller decides what a failure means. */
export async function sendMail(message: MailMessage, fromName: string): Promise<SendResult> {
  const config = readConfig(fromName);
  if (!config) return { ok: false, error: "No mail provider is connected." };

  try {
    await transportFor(config).sendMail({
      from: config.from,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
      replyTo: message.replyTo,
    });
    return { ok: true };
  } catch (error) {
    // The message is safe to store and show to the owner; it never contains the password.
    return { ok: false, error: error instanceof Error ? error.message.slice(0, 300) : "The mail provider refused the message." };
  }
}
