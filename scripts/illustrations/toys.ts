import { CREAM, GLOSS, INK, SHADE, STEEL, WHITE, circ, ell, group, hsl, path, rect, stroke, type Drawer } from "./core";

/** An isometric cube whose bottom corner is at (x, y). Shading comes from translucent overlays. */
function cube(x: number, y: number, s: number, base: string): string {
  const k = 0.87 * s;
  const left = `${x - k},${y - s / 2} ${x},${y} ${x},${y - s} ${x - k},${y - 1.5 * s}`;
  const right = `${x},${y} ${x + k},${y - s / 2} ${x + k},${y - 1.5 * s} ${x},${y - s}`;
  const top = `${x - k},${y - 1.5 * s} ${x},${y - s} ${x + k},${y - 1.5 * s} ${x},${y - 2 * s}`;
  return [
    `<polygon points="${left}" fill="${base}"/><polygon points="${left}" fill="${SHADE}"/>`,
    `<polygon points="${right}" fill="${base}"/>`,
    `<polygon points="${top}" fill="${base}"/><polygon points="${top}" fill="rgba(255,255,255,0.3)"/>`,
    circ(x - k / 2, y - s * 0.75, s * 0.17, "rgba(255,255,255,0.75)"),
    rect(x + k / 2 - s * 0.12, y - s * 1.0, s * 0.24, s * 0.24, "rgba(255,255,255,0.75)", 3),
  ].join("");
}

const blocks: Drawer = (p) =>
  [cube(0, 70, 74, p.a), cube(-76, 112, 74, p.m), cube(76, 112, 74, p.l), cube(0, 154, 74, p.d)].join("");

const teddy: Drawer = (p) =>
  [
    ell(-80, 36, 26, 56, p.m, 'transform="rotate(28 -80 36)"'),
    ell(80, 36, 26, 56, p.m, 'transform="rotate(-28 80 36)"'),
    ell(-44, 128, 36, 28, p.m),
    ell(44, 128, 36, 28, p.m),
    ell(-44, 130, 20, 14, p.l),
    ell(44, 130, 20, 14, p.l),
    ell(0, 50, 72, 88, p.m),
    ell(0, 62, 44, 58, p.l),
    circ(-54, -118, 26, p.m),
    circ(54, -118, 26, p.m),
    circ(-54, -118, 14, p.l),
    circ(54, -118, 14, p.l),
    circ(0, -70, 64, p.m),
    ell(0, -52, 30, 24, p.l),
    ell(0, -62, 9, 6, INK),
    circ(-24, -84, 6, INK),
    circ(24, -84, 6, INK),
    stroke("M0 -56 L0 -48 M-12 -42 Q0 -34 12 -42", INK, 3),
    path("M0 -2 L-34 -18 L-34 14 Z M0 -2 L34 -18 L34 14 Z", p.a),
    circ(0, -2, 9, p.d),
  ].join("");

const boardGame: Drawer = (p) => {
  const squares = Array.from({ length: 16 }, (_, i) => {
    const cx = (i % 4) * 36;
    const cy = Math.floor(i / 4) * 28;
    return rect(-92 + cx, -30 + cy, 36, 28, (i + Math.floor(i / 4)) % 2 === 0 ? WHITE : p.l);
  }).join("");
  return [
    path("M168 -112 L204 -94 L204 108 L168 124 Z", p.d),
    rect(-172, -112, 340, 236, p.m, 10),
    rect(-150, -92, 296, 44, p.l, 8),
    stroke("M-120 -70 L-40 -70 M0 -70 L90 -70", p.d, 8),
    squares,
    rect(-92, -30, 144, 112, "none", 0, `stroke="${INK}" stroke-width="3"`),
    // dice and pawns on the right of the board
    rect(84, 14, 52, 52, WHITE, 8),
    circ(100, 30, 5, INK),
    circ(120, 50, 5, INK),
    circ(110, 40, 5, INK),
    circ(-60, 96, 12, p.a),
    rect(-68, 96, 16, 16, p.a, 4),
    circ(-20, 96, 12, p.d),
    rect(-28, 96, 16, 16, p.d, 4),
  ].join("");
};

const jigsaw: Drawer = (p) => {
  const colors = [p.m, p.a, p.l, p.d, p.m, p.a, p.l, p.d, p.m];
  const cells = colors
    .map((color, i) => {
      const x = -150 + (i % 3) * 100;
      const y = -120 + Math.floor(i / 3) * 100;
      if (i === 2) return "";
      const knobRight = i % 3 !== 2 ? circ(x + 100, y + 50, 15, color) : "";
      const knobBottom = i < 6 ? circ(x + 50, y + 100, 15, color) : "";
      return rect(x, y, 98, 98, color, 6) + knobRight + knobBottom + rect(x + 8, y + 8, 82, 18, GLOSS, 6);
    })
    .join("");
  const loose = group("translate(40 -30) rotate(14 150 -70)", rect(100, -120, 98, 98, p.a, 6) + circ(100, -71, 15, p.a) + rect(108, -112, 82, 18, GLOSS, 6));
  return cells + loose;
};

const rcCar: Drawer = (p) =>
  [
    stroke("M-150 -24 L-176 -134", INK, 4),
    circ(-176, -138, 8, p.a),
    path("M-176 60 L-156 10 Q-136 -20 -96 -26 L-34 -70 Q-12 -84 30 -80 L84 -76 Q116 -66 126 -26 L164 -10 Q184 0 182 60 Z", p.m),
    path("M-24 -62 L10 -62 L10 -28 L-70 -28 Z", p.l),
    path("M24 -62 L66 -62 Q90 -56 96 -28 L24 -28 Z", p.l),
    path("M-176 36 L182 36 L182 60 L-176 60 Z", p.d),
    path("M-40 -10 L120 -10", "none", `stroke="${p.a}" stroke-width="12" stroke-linecap="round"`),
    circ(-104, 66, 44, INK),
    circ(104, 66, 44, INK),
    circ(-104, 66, 20, STEEL),
    circ(104, 66, 20, STEEL),
    circ(-104, 66, 7, INK),
    circ(104, 66, 7, INK),
  ].join("");

const cardGame: Drawer = (p) => {
  const suit = (i: number, c: string): string => {
    if (i === 0) return circ(0, 10, 30, c);
    if (i === 1) return path("M0 -20 L28 10 L0 40 L-28 10 Z", c);
    if (i === 2) return path("M0 -20 L9 3 L34 4 L14 19 L21 42 L0 28 L-21 42 L-14 19 L-34 4 L-9 3 Z", c);
    return path("M0 40 C-50 5 -28 -26 0 -2 C28 -26 50 5 0 40 Z", c);
  };
  const colors = [p.m, p.a, p.d, p.m];
  return [-33, -11, 11, 33]
    .map((angle, i) =>
      group(
        `rotate(${angle} 0 130)`,
        rect(-66, -62, 132, 190, WHITE, 14, `stroke="${hsl(0, 0, 80)}" stroke-width="2"`) +
          rect(-54, -50, 108, 166, "none", 8, `stroke="${colors[i]}" stroke-width="2" opacity="0.5"`) +
          suit(i, colors[i]),
      ),
    )
    .join("") + circ(0, 130, 9, CREAM);
};

export const toys: Record<string, Drawer> = {
  blocks,
  teddy,
  "board-game": boardGame,
  jigsaw,
  "rc-car": rcCar,
  "card-game": cardGame,
};
