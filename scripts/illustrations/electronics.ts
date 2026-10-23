import { GLOSS, INK, STEEL, STEEL_D, WHITE, circ, group, path, rect, stroke, type Drawer } from "./core";

const GOLD = "#d8b04a";

const cpu: Drawer = (p) => {
  const pads = Array.from({ length: 14 }, (_, i) => {
    const t = -120 + i * 18.5;
    return [circ(t, -134, 3.5, GOLD), circ(t, 134, 3.5, GOLD), circ(-134, t, 3.5, GOLD), circ(134, t, 3.5, GOLD)].join("");
  }).join("");
  return group(
    "translate(0 10) scale(1.15)",
    [
      rect(-146, -146, 292, 292, p.d, 18),
      rect(-146, -146, 292, 18, GLOSS, 14),
      pads,
      rect(-98, -98, 196, 196, STEEL, 18),
      rect(-98, -98, 196, 70, "rgba(255,255,255,0.45)", 18),
      rect(-76, -76, 152, 152, "#aab4c0", 12),
      stroke("M-56 -30 L56 -30 M-56 0 L30 0 M-56 30 L56 30", STEEL_D, 6),
      circ(-56, -56, 7, p.a),
      path("M-146 -146 L-110 -146 L-146 -110 Z", GOLD),
    ].join(""),
  );
};

const fan = (cx: number, cy: number, r: number, color: string): string => {
  const blades = Array.from({ length: 9 }, (_, i) =>
    group(`rotate(${i * 40} ${cx} ${cy})`, path(`M${cx} ${cy} Q${cx + r * 0.42} ${cy - r * 0.66} ${cx + r * 0.1} ${cy - r * 0.86} Q${cx - r * 0.34} ${cy - r * 0.5} ${cx} ${cy} Z`, color)),
  ).join("");
  return circ(cx, cy, r, "#0f1419") + circ(cx, cy, r - 8, "#1b222b") + blades + circ(cx, cy, r * 0.22, STEEL_D) + circ(cx, cy, r * 0.1, INK);
};

const gpu: Drawer = (p) =>
  [
    rect(-200, -76, 14, 168, STEEL, 3),
    rect(-186, 92, 220, 18, GOLD, 3),
    rect(-186, -70, 380, 160, "#2b3541", 16),
    rect(-186, -70, 380, 22, p.m, 16),
    rect(-186, -56, 380, 6, p.d),
    fan(-90, 14, 62, "#8d99a8"),
    fan(100, 14, 62, "#8d99a8"),
    rect(160, 70, 40, 12, p.a, 6),
    stroke("M-170 -40 L-130 -40", GLOSS, 5),
    rect(-190, 110, 30, 12, GOLD, 2),
  ].join("");

const ssd: Drawer = (p) =>
  group(
    "rotate(-12)",
    [
      rect(-196, -42, 392, 84, p.d, 8),
      ...Array.from({ length: 18 }, (_, i) => rect(-196 + i * 8, 44, 5, 14, GOLD, 1)),
      rect(-140, -30, 250, 60, p.m, 6),
      rect(-140, -30, 250, 14, GLOSS, 6),
      rect(-126, -8, 60, 26, INK, 3),
      rect(-52, -8, 60, 26, INK, 3),
      rect(22, -8, 76, 26, INK, 3),
      stroke("M-126 -20 L40 -20", WHITE, 3, 'opacity="0.7"'),
      circ(172, 0, 12, "#1b222b"),
      circ(172, 0, 5, STEEL),
    ].join(""),
  );

const ram: Drawer = (p) => {
  const chips = Array.from({ length: 8 }, (_, i) => rect(-170 + i * 44, -8, 36, 38, INK, 3)).join("");
  const pins = Array.from({ length: 40 }, (_, i) => (i === 19 || i === 20 ? "" : rect(-190 + i * 9.4, 62, 5, 20, GOLD, 1))).join("");
  return [
    rect(-196, -66, 392, 136, "#1d242d", 8),
    pins,
    chips,
    rect(-196, -66, 392, 54, p.m, 10),
    rect(-196, -66, 392, 18, GLOSS, 10),
    ...Array.from({ length: 12 }, (_, i) => rect(-180 + i * 32, -50, 18, 6, p.d, 3)),
    rect(-196, -20, 392, 8, p.a),
    circ(-178, 40, 7, "#0b0f13"),
    circ(178, 40, 7, "#0b0f13"),
  ].join("");
};

const keyboard: Drawer = (p) => {
  const rows = [
    { y: -62, n: 13, w: 24 },
    { y: -28, n: 12, w: 26 },
    { y: 6, n: 11, w: 28 },
    { y: 40, n: 10, w: 30 },
  ];
  const keys = rows
    .map(({ y, n, w }, ri) => {
      const total = n * (w + 5);
      return Array.from({ length: n }, (_, i) => {
        const x = -total / 2 + i * (w + 5);
        const accent = (ri === 0 && i === 0) || (ri === 2 && i === n - 1);
        return rect(x, y, w, 28, accent ? p.a : WHITE, 6) + rect(x, y + 20, w, 8, "rgba(0,0,0,0.12)", 4);
      }).join("");
    })
    .join("");
  return [
    rect(-200, -92, 400, 196, INK, 20),
    rect(-200, -92, 400, 18, GLOSS, 14),
    keys,
    rect(-92, 76, 184, 24, WHITE, 8),
    rect(-92, 90, 184, 10, "rgba(0,0,0,0.12)", 5),
    rect(-186, 76, 70, 24, p.m, 8),
    rect(116, 76, 70, 24, p.m, 8),
  ].join("");
};

const mouse: Drawer = (p) =>
  group(
    "rotate(8)",
    [
      path("M0 -150 Q96 -150 104 -30 L92 108 Q64 166 0 166 Q-64 166 -92 108 L-104 -30 Q-96 -150 0 -150 Z", p.m),
      path("M0 -150 Q-96 -150 -104 -30 L-92 108 Q-64 166 0 166 Z", "rgba(255,255,255,0.12)"),
      stroke("M-102 -36 Q0 -22 102 -36", p.d, 4),
      stroke("M0 -148 L0 -30", p.d, 4),
      rect(-13, -112, 26, 56, INK, 13),
      rect(-9, -106, 8, 18, "rgba(255,255,255,0.5)", 4),
      rect(-108, 20, 18, 46, p.a, 8),
      rect(-108, 76, 18, 30, p.a, 8),
      path("M-70 -120 Q-40 -144 -10 -146 Q-50 -120 -76 -76 Z", GLOSS),
      circ(0, 110, 18, "rgba(255,255,255,0.22)"),
    ].join(""),
  );

export const electronics: Record<string, Drawer> = {
  cpu,
  gpu,
  ssd,
  ram,
  keyboard,
  mouse,
};
