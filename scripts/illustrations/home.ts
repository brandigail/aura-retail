import { CREAM, GLOSS, INK, STEEL_D, WHITE, circ, ell, group, hsl, path, rect, stroke, type Drawer } from "./core";

const candle: Drawer = (p) =>
  [
    circ(0, -78, 76, "rgba(255,200,90,0.2)"),
    circ(0, -78, 44, "rgba(255,200,90,0.28)"),
    path("M0 -134 Q-30 -88 0 -52 Q30 -88 0 -134 Z", "#f6a02a"),
    path("M0 -112 Q-14 -86 0 -68 Q14 -86 0 -112 Z", "#ffe08a"),
    stroke("M0 -52 L0 -28", INK, 4),
    rect(-92, -30, 184, 178, "rgba(210,230,240,0.55)", 26, `stroke="${hsl(200, 25, 70)}" stroke-width="3"`),
    rect(-82, 0, 164, 138, p.l, 16),
    rect(-82, 0, 164, 20, "rgba(255,255,255,0.35)", 10),
    rect(-58, 42, 116, 62, CREAM, 8),
    stroke("M-40 62 L40 62 M-40 82 L18 82", p.d, 5),
    path("M-84 -20 Q-90 60 -84 124 L-74 124 Q-80 60 -74 -20 Z", GLOSS),
  ].join("");

const vase: Drawer = (p) => {
  const flower = (x: number, y: number, c: string) =>
    [0, 72, 144, 216, 288].map((a) => group(`rotate(${a} ${x} ${y})`, ell(x, y - 18, 11, 18, c))).join("") + circ(x, y, 8, "#f4b53a");
  return [
    stroke("M-6 -50 Q-30 -100 -50 -130", "#4c9a52", 6),
    stroke("M0 -50 Q4 -110 2 -168", "#4c9a52", 6),
    stroke("M6 -50 Q36 -90 58 -122", "#4c9a52", 6),
    flower(-52, -134, p.a),
    flower(2, -172, WHITE),
    flower(60, -126, p.l),
    path("M-42 -60 Q-42 -20 -92 40 Q-114 108 -62 146 L62 146 Q114 108 92 40 Q42 -20 42 -60 Z", p.m),
    ell(0, -60, 42, 10, p.d),
    path("M-96 70 Q0 96 96 70 L100 92 Q0 118 -100 92 Z", p.a, 'opacity="0.9"'),
    path("M-60 40 Q-84 100 -50 140 L-40 140 Q-66 100 -48 40 Z", GLOSS),
  ].join("");
};

const cushion: Drawer = (p) => {
  const diamonds = [-70, 0, 70]
    .flatMap((x) => [-60, 20, 100].map((y) => path(`M${x} ${y - 26} L${x + 26} ${y} L${x} ${y + 26} L${x - 26} ${y} Z`, "none", `stroke="${p.l}" stroke-width="3"`)))
    .join("");
  return [
    group(
      "rotate(14) translate(60 -40) scale(0.85)",
      path("M-140 -130 Q0 -150 140 -130 Q160 0 140 130 Q0 150 -140 130 Q-160 0 -140 -130 Z", p.a) + path("M-140 -130 Q-40 -70 0 0 Q-40 70 -140 130", "none", `stroke="rgba(0,0,0,0.12)" stroke-width="6"`),
    ),
    group(
      "rotate(-6) translate(-20 10)",
      [
        path("M-140 -130 Q0 -150 140 -130 Q160 0 140 130 Q0 150 -140 130 Q-160 0 -140 -130 Z", p.m),
        diamonds,
        stroke("M-140 -130 L-60 -50 M140 -130 L60 -50 M-140 130 L-60 50 M140 130 L60 50", "rgba(0,0,0,0.14)", 6),
        circ(0, 0, 11, p.d),
        path("M-120 -100 Q-30 -128 60 -122 Q-40 -104 -120 -100 Z", GLOSS),
      ].join(""),
    ),
  ].join("");
};

const tableLamp: Drawer = (p) =>
  [
    ell(0, 30, 170, 70, "rgba(255,220,140,0.2)"),
    path("M-72 -166 L72 -166 L124 -56 L-124 -56 Z", CREAM),
    path("M-72 -166 L-30 -166 L-50 -56 L-124 -56 Z", "rgba(255,255,255,0.5)"),
    path("M-98 -108 L98 -108 L104 -94 L-104 -94 Z", p.a),
    ell(0, -56, 124, 14, "#f9d98c"),
    rect(-9, -56, 18, 86, STEEL_D, 4),
    path("M-52 146 L52 146 Q80 70 34 22 L-34 22 Q-80 70 -52 146 Z", p.m),
    path("M-40 40 Q-66 80 -44 140 L-34 140 Q-52 80 -30 40 Z", GLOSS),
    rect(-64, 140, 128, 12, p.d, 6),
    circ(0, -80, 14, "rgba(255,240,180,0.9)"),
  ].join("");

const wallClock: Drawer = (p) => {
  const ticks = Array.from({ length: 12 }, (_, i) => group(`rotate(${i * 30})`, rect(-3, -126, 6, i % 3 === 0 ? 24 : 12, INK, 3))).join("");
  return [
    circ(0, 0, 158, p.m),
    circ(0, 0, 158, "none", `stroke="${p.d}" stroke-width="6"`),
    circ(0, 0, 138, WHITE),
    circ(0, 0, 138, "none", `stroke="rgba(0,0,0,0.1)" stroke-width="3"`),
    ticks,
    group("rotate(-60)", rect(-5, -84, 10, 92, INK, 5)),
    group("rotate(35)", rect(-4, -118, 8, 126, INK, 4)),
    group("rotate(140)", rect(-2, -122, 4, 134, p.a, 2)),
    circ(0, 0, 12, p.a),
    circ(0, 0, 5, WHITE),
    path("M-118 -70 Q-70 -122 -10 -134 Q-80 -108 -118 -70 Z", "rgba(0,0,0,0.04)"),
    path("M-148 -40 A152 152 0 0 1 -60 -134 L-66 -120 A138 138 0 0 0 -134 -40 Z", GLOSS),
  ].join("");
};

const mugs: Drawer = (p) => {
  const mug = (x: number, y: number, color: string) =>
    [
      circ(x + 66, y - 6, 32, "none", `stroke="${color}" stroke-width="15"`),
      rect(x - 64, y - 74, 128, 128, color, 20),
      rect(x - 64, y - 74, 128, 30, "rgba(255,255,255,0.22)", 16),
      ell(x, y - 74, 64, 15, "rgba(255,255,255,0.5)"),
      ell(x, y - 72, 54, 11, "#5b3a22"),
      path(`M${x - 50} ${y - 40} Q${x - 56} ${y + 10} ${x - 50} ${y + 44} L${x - 40} ${y + 44} Q${x - 46} ${y + 10} ${x - 40} ${y - 40} Z`, GLOSS),
      stroke(`M${x - 12} ${y - 100} q14 -20 0 -40 M${x + 18} ${y - 100} q14 -20 0 -40`, "rgba(120,130,140,0.5)", 6),
    ].join("");
  return mug(-92, 80, p.m) + mug(84, 104, p.a);
};

export const home: Record<string, Drawer> = {
  candle,
  vase,
  cushion,
  "table-lamp": tableLamp,
  "wall-clock": wallClock,
  mugs,
};
