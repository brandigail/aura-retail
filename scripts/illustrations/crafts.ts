import { CREAM, GLOSS, STEEL, STEEL_D, WHITE, WOOD, WOOD_D, circ, ell, group, hsl, path, rect, stroke, type Drawer } from "./core";

const knittingNeedles: Drawer = (p) => {
  const rows = Array.from({ length: 6 }, (_, r) =>
    Array.from({ length: 9 }, (_, c) => stroke(`M${-80 + c * 20 + (r % 2) * 10} ${84 + r * 14} l5 8 l5 -8`, p.d, 2.4)).join(""),
  ).join("");
  return [
    group("rotate(35)", rect(-190, -9, 380, 18, WOOD, 9) + circ(-194, 0, 14, WOOD_D) + path("M190 -9 L220 0 L190 9 Z", WOOD_D)),
    group("rotate(-35)", rect(-190, -9, 380, 18, p.a, 9) + circ(-194, 0, 14, p.d) + path("M190 -9 L220 0 L190 9 Z", p.d)),
    rect(-92, 78, 184, 92, p.m, 10),
    rows,
    rect(-92, 78, 184, 14, GLOSS, 6),
  ].join("");
};

const yarnBall: Drawer = (p) => {
  const strands = [-90, -62, -34, -6, 22, 50, 78].map((y, i) =>
    stroke(`M${-110 + Math.abs(y) * 0.15} ${y} Q0 ${y + 52} ${110 - Math.abs(y) * 0.15} ${y - 10}`, i % 2 ? p.d : p.l, 7, 'opacity="0.8"'),
  );
  return [
    circ(0, 20, 124, p.m),
    ...strands,
    stroke("M-72 -60 Q-20 90 80 -86", p.d, 5, 'opacity="0.7"'),
    stroke("M-110 40 Q-30 130 100 70", p.l, 6, 'opacity="0.75"'),
    path("M-96 -30 A124 124 0 0 1 -20 -100 Q-60 -70 -96 -30 Z", GLOSS),
    stroke("M104 108 C190 134 170 176 70 160 C20 152 40 120 90 130", p.m, 7),
  ].join("");
};

const crochetHooks: Drawer = (p) => {
  const colors = [p.m, p.a, p.l, p.d, hsl(0, 0, 90)];
  const hook = (color: string, y: number) =>
    rect(-196, y - 10, 250, 20, color, 10) +
    rect(-196, y - 10, 250, 7, GLOSS, 4) +
    rect(54, y - 4, 130, 8, STEEL, 4) +
    stroke(`M182 ${y} q16 -16 26 -2`, STEEL_D, 6);
  return group("rotate(-10)", [-84, -42, 0, 42, 84].map((y, i) => hook(colors[i], y)).join(""));
};

const embroideryHoop: Drawer = (p) => {
  const petals = [0, 72, 144, 216, 288].map((a) => group(`rotate(${a})`, ell(0, -30, 17, 28, a % 144 === 0 ? p.m : p.a))).join("");
  return [
    circ(0, 8, 142, CREAM),
    circ(0, 8, 142, "none", `stroke="${WOOD}" stroke-width="16"`),
    circ(0, 8, 126, "none", `stroke="${WOOD_D}" stroke-width="4"`),
    rect(-18, -156, 36, 26, STEEL, 6),
    rect(-6, -166, 12, 14, STEEL_D, 3),
    stroke("M0 38 Q-14 80 -4 110", "#4c9a52", 5),
    stroke("M-2 80 Q-40 74 -52 52 Q-18 52 -2 80", "#4c9a52", 4),
    stroke("M2 94 Q40 90 56 66 Q22 66 2 94", "#4c9a52", 4),
    group("translate(0 8)", petals + circ(0, 0, 14, "#f4b53a")),
    ...[[-80, 90], [80, 92], [-90, -40], [92, -30]].map(([x, y]) => circ(x, y, 7, p.l)),
  ].join("");
};

const craftScissors: Drawer = (p) =>
  group(
    "translate(0 20) rotate(28)",
    [
      path("M0 14 L-30 -160 L-10 -160 L16 14 Z", STEEL),
      path("M0 14 L30 -160 L10 -160 L-16 14 Z", "#dfe5ea"),
      path("M-30 -160 L-24 -160 L2 10 L-2 12 Z", "rgba(255,255,255,0.6)"),
      stroke("M-14 18 Q-48 52 -42 80", p.d, 16),
      stroke("M14 18 Q48 52 42 80", p.d, 16),
      circ(-42, 112, 32, "none", `stroke="${p.m}" stroke-width="18"`),
      circ(42, 112, 32, "none", `stroke="${p.a}" stroke-width="18"`),
      circ(0, 12, 9, STEEL_D),
      circ(0, 12, 3, WHITE),
    ].join(""),
  );

const sewingKit: Drawer = (p) => {
  const spool = (x: number, y: number, c: string) =>
    rect(x - 22, y, 44, 10, WOOD, 4) + rect(x - 18, y + 8, 36, 40, c, 3) + rect(x - 22, y + 46, 44, 10, WOOD, 4) + rect(x - 14, y + 10, 8, 36, GLOSS);
  return [
    spool(-96, -80, p.a),
    spool(-30, -100, p.l),
    spool(40, -70, hsl(0, 0, 92)),
    stroke("M100 -60 L92 10", STEEL, 4),
    circ(100, -62, 5, p.a),
    ell(130, 0, 36, 28, "#d9534f"),
    circ(120, -20, 4, WHITE),
    circ(140, -12, 4, p.a),
    rect(-160, 20, 320, 120, p.m, 22),
    ell(0, 20, 160, 36, p.l),
    ell(0, 24, 142, 26, p.d),
    rect(-160, 88, 320, 14, p.d),
    rect(-160, 20, 320, 22, GLOSS, 10),
    circ(-56, 74, 10, STEEL),
    circ(0, 70, 10, p.a),
    circ(56, 74, 10, STEEL),
  ].join("");
};

export const crafts: Record<string, Drawer> = {
  "knitting-needles": knittingNeedles,
  "yarn-ball": yarnBall,
  "crochet-hooks": crochetHooks,
  "embroidery-hoop": embroideryHoop,
  "craft-scissors": craftScissors,
  "sewing-kit": sewingKit,
};
