/** Colours derived from a product's hue, so every product gets its own colourway. */
export interface Palette {
  /** Main brand colour of the object. */
  m: string;
  /** Darker shade for outlines and shading. */
  d: string;
  /** Lighter tint for highlights. */
  l: string;
  /** Contrasting accent colour. */
  a: string;
}

/**
 * Draws one object centred on (0, 0) in a roughly 400 x 340 area, with its base resting near y = 150.
 * The renderer places it on a background and adds the floor shadow.
 */
export type Drawer = (p: Palette) => string;

export const hsl = (h: number, s: number, l: number, alpha = 1): string =>
  `hsl(${((h % 360) + 360) % 360} ${s}% ${l}%${alpha < 1 ? ` / ${alpha}` : ""})`;

export function paletteFor(hue: number): Palette {
  return { m: hsl(hue, 62, 50), d: hsl(hue, 58, 30), l: hsl(hue, 72, 80), a: hsl(hue + 150, 70, 55) };
}

/** Neutral materials shared by many objects. */
export const STEEL = "#c9d1d9";
export const STEEL_D = "#8693a1";
export const WOOD = "#c98f56";
export const WOOD_D = "#8a5a2c";
export const INK = "#27313c";
export const WHITE = "#ffffff";
export const CREAM = "#f6efe2";

/** Tiny SVG builders so the drawings below stay readable. `extra` is raw attribute text. */
export const rect = (x: number, y: number, w: number, h: number, fill: string, rx = 0, extra = ""): string =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
export const circ = (cx: number, cy: number, r: number, fill: string, extra = ""): string =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${extra}/>`;
export const ell = (cx: number, cy: number, rx: number, ry: number, fill: string, extra = ""): string =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
export const path = (d: string, fill: string, extra = ""): string => `<path d="${d}" fill="${fill}" ${extra}/>`;
/** A stroked, unfilled path. */
export const stroke = (d: string, color: string, width: number, extra = ""): string =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
/** Wraps content in a transform group. */
export const group = (transform: string, content: string): string => `<g transform="${transform}">${content}</g>`;
/** Soft translucent overlays used to fake shading on any base colour. */
export const SHADE = "rgba(0,0,0,0.2)";
export const GLOSS = "rgba(255,255,255,0.28)";

/** A text label drawn as SVG, for the detail card. */
export function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
