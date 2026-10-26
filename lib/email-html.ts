/** Small HTML-email toolkit. Emails need inline styles and tables to look right in every mail app. */

const ACCENT = "#008080";
const TEXT = "#0f172a";
const MUTED = "#475569";
const BORDER = "#e2e8f0";

export function esc(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/** Line breaks in plain text (like an address) become <br> after escaping. */
export function multiline(value: string): string {
  return esc(value).replace(/\r?\n/g, "<br>");
}

export function button(label: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0"><tr><td style="background:${ACCENT};border-radius:6px"><a href="${esc(url)}" style="display:inline-block;padding:13px 26px;color:#ffffff;font-weight:600;font-size:16px;text-decoration:none">${esc(label)}</a></td></tr></table>`;
}

export interface EmailRow {
  label: string;
  value: string;
  /** Bold, larger row for the grand total. */
  strong?: boolean;
}

/** A two-column list: left label, right-aligned value. Values must already be escaped. */
export function rowsTable(rows: readonly EmailRow[]): string {
  const cells = rows
    .map((r) => {
      const style = `padding:6px 0;font-size:${r.strong ? 17 : 15}px;${r.strong ? `font-weight:700;border-top:1px solid ${BORDER};padding-top:12px;` : `color:${MUTED};`}`;
      return `<tr><td style="${style}">${esc(r.label)}</td><td align="right" style="${style}${r.strong ? "" : `color:${TEXT};`}">${r.value}</td></tr>`;
    })
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:12px 0">${cells}</table>`;
}

export function heading(text: string): string {
  return `<h1 style="margin:0 0 12px;font-size:24px;line-height:1.3;color:${TEXT}">${esc(text)}</h1>`;
}

export function paragraph(html: string): string {
  return `<p style="margin:0 0 14px;font-size:16px;line-height:1.6;color:${TEXT}">${html}</p>`;
}

export function subheading(text: string): string {
  return `<h2 style="margin:24px 0 6px;font-size:16px;color:${TEXT}">${esc(text)}</h2>`;
}

interface LayoutOptions {
  storeName: string;
  /** Preview text shown next to the subject in the inbox list. */
  preheader: string;
  bodyHtml: string;
  footerHtml: string;
}

export function layout({ storeName, preheader, bodyHtml, footerHtml }: LayoutOptions): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(storeName)}</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
<span style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">
<tr><td style="padding:0 0 14px;font-size:22px;font-weight:700;color:${ACCENT}">${esc(storeName)}</td></tr>
<tr><td style="background:#ffffff;border:1px solid ${BORDER};border-radius:10px;padding:28px">${bodyHtml}</td></tr>
<tr><td style="padding:16px 4px;font-size:13px;line-height:1.6;color:${MUTED}">${footerHtml}</td></tr>
</table></td></tr></table></body></html>`;
}
