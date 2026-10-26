/**
 * A cell that starts with = + - @ (or a tab/return) can be run as a formula when the file is opened in Excel or
 * Sheets. Customer-typed text like names and addresses must never be able to do that, so such cells get a
 * leading apostrophe, which spreadsheets show as plain text.
 */
function neutralise(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

export function csvCell(value: string | number | null | undefined): string {
  const text = neutralise(value === null || value === undefined ? "" : String(value));
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** Builds a CSV file. The leading byte-order mark makes Excel read accented characters correctly. */
export function toCsv(header: readonly string[], rows: readonly (string | number | null | undefined)[][]): string {
  const lines = [header, ...rows].map((row) => row.map(csvCell).join(","));
  return `﻿${lines.join("\r\n")}\r\n`;
}

/** Integer cents as a plain decimal like "39.49", which spreadsheets treat as a number. */
export function centsToDecimal(cents: number): string {
  return (cents / 100).toFixed(2);
}
