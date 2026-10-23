import { WHITE, escapeXml, hsl, paletteFor, type Drawer } from "./core";

const W = 800;
const H = 600;

/** Greedy word wrap for SVG text, which has no automatic wrapping. */
function wrap(text: string, maxChars: number, maxLines: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    if (line && (line + " " + word).length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = kept[maxLines - 1].replace(/\s*\S*$/, "") + "…";
    return kept;
  }
  return lines;
}

const svgOpen = (title: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${escapeXml(title)}">`;

/** Main product image: the object on a soft tinted background with a floor shadow. */
export function renderMain(title: string, hue: number, draw: Drawer): string {
  const p = paletteFor(hue);
  return [
    svgOpen(title),
    `<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hsl(hue, 70, 96)}"/><stop offset="1" stop-color="${hsl(hue, 55, 86)}"/></linearGradient></defs>`,
    `<rect width="${W}" height="${H}" fill="url(#bg)"/>`,
    `<circle cx="650" cy="110" r="150" fill="${hsl(hue + 20, 80, 92, 0.7)}"/>`,
    `<circle cx="110" cy="520" r="120" fill="${hsl(hue - 20, 70, 90, 0.7)}"/>`,
    `<ellipse cx="400" cy="490" rx="250" ry="22" fill="rgba(20,30,40,0.14)"/>`,
    `<g transform="translate(400 285) scale(1.38)">${draw(p)}</g>`,
    `</svg>`,
  ].join("");
}

/** Second image: a dark detail card with the object, the name and the key specs. */
export function renderDetail(
  title: string,
  hue: number,
  draw: Drawer,
  specs: Array<[string, string]>,
): string {
  const p = paletteFor(hue);
  const nameLines = wrap(title, 22, 3);
  const specRows = specs.slice(0, 4).map(([k, v], i) => {
    const y = 330 + i * 62;
    const value = v.length > 26 ? v.slice(0, 25) + "…" : v;
    return [
      `<rect x="430" y="${y - 28}" width="330" height="50" rx="12" fill="rgba(255,255,255,0.08)"/>`,
      `<text x="448" y="${y - 6}" font-family="system-ui, sans-serif" font-size="14" fill="${hsl(hue, 60, 78)}">${escapeXml(k.toUpperCase())}</text>`,
      `<text x="448" y="${y + 14}" font-family="system-ui, sans-serif" font-size="19" font-weight="600" fill="${WHITE}">${escapeXml(value)}</text>`,
    ].join("");
  });

  return [
    svgOpen(`${title}, details`),
    `<defs><linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${hsl(hue, 45, 20)}"/><stop offset="1" stop-color="${hsl(hue + 25, 50, 12)}"/></linearGradient></defs>`,
    `<rect width="${W}" height="${H}" fill="url(#bg2)"/>`,
    `<circle cx="210" cy="300" r="190" fill="${hsl(hue, 70, 55, 0.18)}"/>`,
    `<ellipse cx="210" cy="474" rx="170" ry="16" fill="rgba(0,0,0,0.3)"/>`,
    `<g transform="translate(210 330) scale(0.92)">${draw(p)}</g>`,
    nameLines
      .map((line, i) => `<text x="430" y="${92 + i * 38}" font-family="system-ui, sans-serif" font-size="30" font-weight="700" fill="${WHITE}">${escapeXml(line)}</text>`)
      .join(""),
    `<rect x="430" y="${92 + (nameLines.length - 1) * 38 + 18}" width="64" height="5" rx="2.5" fill="${hsl(hue + 20, 80, 62)}"/>`,
    specRows.join(""),
    `<text x="430" y="572" font-family="system-ui, sans-serif" font-size="14" fill="${hsl(hue, 30, 70)}">Illustration</text>`,
    `</svg>`,
  ].join("");
}

