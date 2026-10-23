import { GLOSS, INK, STEEL, STEEL_D, WHITE, circ, ell, group, path, rect, stroke, type Drawer } from "./core";

const TERRACOTTA = "#c8643c";
const LEAF = "#4c9a52";

const plantPots: Drawer = (p) => {
  const pot = (x: number, y: number, w: number, h: number) =>
    [
      path(`M${x - w} ${y} L${x + w} ${y} L${x + w * 0.72} ${y + h} L${x - w * 0.72} ${y + h} Z`, TERRACOTTA),
      rect(x - w - 8, y - 18, w * 2 + 16, 26, "#d9794f", 8),
      path(`M${x - w + 8} ${y + 8} L${x - w * 0.6} ${y + h - 6} L${x - w * 0.5} ${y + h - 6} L${x - w + 22} ${y + 8} Z`, GLOSS),
    ].join("");
  const leaves = (x: number, y: number, n: number, color: string) =>
    Array.from({ length: n }, (_, i) => {
      const a = -70 + (140 / (n - 1)) * i;
      return group(`rotate(${a} ${x} ${y})`, ell(x, y - 42, 15, 44, color));
    }).join("");
  return [
    leaves(-110, 18, 6, LEAF),
    pot(-110, 20, 62, 100),
    leaves(0, -30, 7, p.m),
    pot(0, -20, 76, 150),
    stroke("M104 74 L104 10", LEAF, 5),
    circ(104, 4, 20, p.a),
    circ(104, 4, 8, "#f4b53a"),
    leaves(104, 50, 5, LEAF),
    pot(104, 70, 52, 82),
  ].join("");
};

const wateringCan: Drawer = (p) =>
  [
    stroke("M-62 -22 Q0 -130 66 -22", p.d, 16),
    path("M-90 -10 L-70 -10 Q-20 -30 30 -10 L70 -10 L84 124 Q84 140 66 140 L-80 140 Q-96 140 -94 124 Z", p.m),
    ell(0, -12, 74, 14, p.d),
    ell(0, -12, 62, 9, "#1b242c"),
    path("M70 90 L196 -64 L214 -50 L88 122 Z", p.d),
    group("rotate(-40 206 -60)", ell(206, -60, 34, 14, STEEL) + ell(206, -60, 28, 9, STEEL_D)),
    ...[-14, -4, 6, 16].map((dy) => circ(222 + dy * 0.2, -64 + dy - 8, 2.6, INK)),
    stroke("M-92 30 Q-170 60 -96 110", p.d, 16),
    rect(-76, 38, 150, 18, p.a),
    path("M-86 0 Q-92 70 -84 130 L-70 130 Q-78 70 -72 0 Z", GLOSS),
  ].join("");

const gardenTools: Drawer = (p) => {
  const grip = (y: number) =>
    rect(-22, y, 44, 120, p.m, 22) +
    rect(-22, y, 12, 120, GLOSS, 6) +
    [0, 1, 2, 3].map((i) => stroke(`M-18 ${y + 30 + i * 18} l36 0`, p.d, 3)).join("");
  const trowel = group(
    "translate(-92 0) rotate(-6)",
    path("M-46 -8 Q-46 -140 0 -152 Q46 -140 46 -8 Z", STEEL) +
      path("M-46 -8 Q-46 -140 0 -152 L0 -8 Z", "rgba(255,255,255,0.35)") +
      rect(-8, -10, 16, 44, STEEL_D, 4) +
      grip(30),
  );
  const fork = group(
    "translate(96 0) rotate(7)",
    [-34, -7, 20].map((x) => rect(x, -150, 14, 122, STEEL, 7)).join("") +
      rect(-34, -40, 68, 24, STEEL, 8) +
      rect(-8, -20, 16, 50, STEEL_D, 4) +
      grip(30),
  );
  return trowel + fork;
};

const drill: Drawer = (p) =>
  [
    rect(-210, -14, 22, 28, STEEL_D, 4),
    path("M-188 -22 L-150 -34 L-150 34 L-188 22 Z", STEEL),
    rect(-150, -42, 70, 84, p.d, 14),
    rect(-96, -62, 190, 108, p.m, 26),
    rect(-96, -62, 190, 26, GLOSS, 18),
    ...[-30, -10, 10].map((x) => rect(x, -50, 6, 24, p.d, 3)),
    path("M-20 40 L66 40 L46 166 Q44 176 34 176 L-14 176 Q-24 176 -26 166 Z", INK),
    rect(-34, 168, 108, 26, p.d, 8),
    rect(-34, 168, 108, 8, GLOSS, 4),
    rect(-6, 44, 26, 40, p.a, 8),
    circ(70, -24, 8, p.a),
    path("M-86 -54 Q-60 -62 -34 -56 Q-60 -52 -86 -48 Z", "rgba(255,255,255,0.5)"),
  ].join("");

const toolbox: Drawer = (p) =>
  [
    rect(-84, -86, 168, 20, INK, 10),
    rect(-84, -86, 168, 6, GLOSS, 3),
    rect(-84, -70, 14, 34, INK, 4),
    rect(70, -70, 14, 34, INK, 4),
    rect(-182, -36, 364, 176, p.m, 18),
    rect(-182, -36, 364, 54, p.d, 18),
    rect(-182, 4, 364, 14, p.d),
    rect(-182, -36, 364, 14, GLOSS, 10),
    rect(-126, -8, 34, 40, STEEL, 6),
    rect(92, -8, 34, 40, STEEL, 6),
    circ(-109, 6, 4, STEEL_D),
    circ(109, 6, 4, STEEL_D),
    rect(-50, 52, 100, 62, WHITE, 8),
    path("M-26 98 L-6 66 L8 88 L18 74 L30 98 Z", p.a),
    rect(-182, 124, 364, 16, "rgba(0,0,0,0.2)", 8),
  ].join("");

const gloves: Drawer = (p) => {
  const glove = (fill: string, cuff: string) =>
    [
      ...[
        [-62, -112, 26],
        [-32, -138, 26],
        [-2, -128, 26],
        [28, -104, 26],
      ].map(([x, y, w]) => rect(x, y, w, 122, fill, 13)),
      rect(-66, -30, 128, 140, fill, 30),
      group("rotate(-38 -62 34)", rect(-100, 20, 30, 86, fill, 15)),
      rect(-66, 20, 128, 38, "rgba(255,255,255,0.18)", 12),
      rect(-70, 104, 136, 48, cuff, 12),
      stroke("M-70 128 l136 0", "rgba(255,255,255,0.4)", 3),
      rect(-66, -30, 128, 14, GLOSS, 8),
    ].join("");
  return group("translate(70 14) rotate(14)", glove(p.a, p.d)) + group("translate(-60 14) rotate(-8)", glove(p.m, p.d));
};

export const garden: Record<string, Drawer> = {
  "plant-pots": plantPots,
  "watering-can": wateringCan,
  "garden-tools": gardenTools,
  drill,
  toolbox,
  gloves,
};
