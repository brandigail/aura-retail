import { CREAM, GLOSS, INK, STEEL, STEEL_D, WHITE, circ, ell, group, path, rect, stroke, type Drawer } from "./core";

const paw = (x: number, y: number, s: number, fill: string): string =>
  ell(x, y + 6 * s, 11 * s, 9 * s, fill) +
  [[-14, -8], [-5, -16], [5, -16], [14, -8]].map(([dx, dy]) => ell(x + dx * s, y + dy * s, 4.5 * s, 6 * s, fill)).join("");

const dogBed: Drawer = (p) =>
  [
    ell(0, 82, 200, 84, p.d),
    ell(0, 70, 200, 78, p.m),
    ell(0, 62, 150, 52, p.l),
    ell(0, 66, 128, 40, "rgba(0,0,0,0.08)"),
    path("M-200 70 Q-200 -10 -120 -34 Q0 -70 120 -34 Q200 -10 200 70 Q150 20 0 14 Q-150 20 -200 70 Z", p.m),
    path("M-170 30 Q-160 -6 -110 -22 Q-150 6 -170 30 Z", GLOSS),
    stroke("M-120 70 Q0 96 120 70", "rgba(255,255,255,0.5)", 3, 'stroke-dasharray="7 7"'),
    paw(0, 56, 1.4, p.d),
    group("rotate(-24 120 100)", rect(80, 100, 90, 24, CREAM, 12) + circ(84, 106, 14, CREAM) + circ(84, 118, 14, CREAM) + circ(166, 106, 14, CREAM) + circ(166, 118, 14, CREAM)),
  ].join("");

const petBowl: Drawer = (p) =>
  [
    path("M-156 -10 Q-136 120 -86 134 L86 134 Q136 120 156 -10 Z", p.m),
    path("M-156 -10 Q-142 40 -122 90 Q-138 20 -124 -10 Z", GLOSS),
    rect(-92, 128, 184, 16, p.d, 8),
    ell(0, -10, 156, 34, STEEL),
    ell(0, -8, 138, 26, "#2b3138"),
    ...[[-60, -6], [-20, -14], [24, -8], [60, -4], [-38, 0], [4, 2], [40, 4], [-8, -10]].map(([x, y]) => circ(x, y, 9, "#8a5a2c")),
    paw(0, 66, 2.2, WHITE),
    ell(0, -10, 156, 34, "none", `stroke="${STEEL_D}" stroke-width="3"`),
  ].join("");

const leash: Drawer = (p) =>
  [
    stroke("M70 40 C170 70 196 -30 130 -76 C70 -118 0 -90 -10 -150", p.d, 18),
    stroke("M70 40 C170 70 196 -30 130 -76 C70 -118 0 -90 -10 -150", p.l, 4, 'stroke-dasharray="2 12"'),
    circ(-10, -152, 22, "none", `stroke="${p.d}" stroke-width="14"`),
    ell(-60, 52, 112, 82, "none", `stroke="${p.m}" stroke-width="30"`),
    ell(-60, 52, 112, 82, "none", `stroke="rgba(255,255,255,0.45)" stroke-width="3" stroke-dasharray="8 8"`),
    rect(36, 22, 46, 46, STEEL, 8),
    rect(44, 30, 30, 30, STEEL_D, 5),
    stroke("M60 -4 L60 22", STEEL_D, 8),
    circ(-60, 138, 28, p.a),
    circ(-60, 138, 28, "none", `stroke="rgba(0,0,0,0.2)" stroke-width="3"`),
    paw(-60, 134, 1.2, WHITE),
  ].join("");

const chewBone: Drawer = (p) =>
  [
    group(
      "rotate(-24)",
      [
        rect(-112, -28, 224, 56, p.l, 28),
        circ(-124, -36, 38, p.l),
        circ(-124, 36, 38, p.l),
        circ(124, -36, 38, p.l),
        circ(124, 36, 38, p.l),
        rect(-112, -28, 224, 14, "rgba(255,255,255,0.4)", 7),
        ...[-60, -20, 20, 60].map((x) => stroke(`M${x} -22 l0 44`, p.m, 6, 'opacity="0.4"')),
      ].join(""),
    ),
    circ(128, 108, 36, "#d7e84a"),
    stroke("M100 94 Q128 118 156 94 M100 122 Q128 98 156 122", WHITE, 4),
  ].join("");

const scratchingPost: Drawer = (p) => {
  const rope = Array.from({ length: 14 }, (_, i) => stroke(`M-30 ${-96 + i * 16} l60 6`, "#b8975a", 6)).join("");
  return [
    rect(-150, 124, 300, 30, p.m, 10),
    rect(-150, 124, 300, 8, GLOSS, 4),
    rect(-32, -102, 64, 228, "#d9bf8c", 6),
    rope,
    rect(-32, -102, 14, 228, "rgba(255,255,255,0.25)"),
    rect(-104, -128, 208, 32, p.m, 14),
    rect(-104, -128, 208, 9, GLOSS, 6),
    stroke("M70 -96 L70 -4", INK, 3),
    circ(70, 10, 18, p.a),
    stroke("M56 4 q14 -8 28 0", WHITE, 3),
  ].join("");
};

const catToyMice: Drawer = (p) => {
  const mouse = (x: number, y: number, s: number, c: string) =>
    group(
      `translate(${x} ${y}) scale(${s})`,
      [
        stroke("M-48 6 Q-96 -6 -92 -44 Q-90 -62 -74 -58", "#d98aa0", 6),
        ell(0, 0, 54, 36, c),
        ell(-12, -8, 34, 14, "rgba(255,255,255,0.25)"),
        circ(34, -26, 18, c),
        circ(34, -26, 10, "#f2b6c4"),
        circ(52, -10, 5, "#d98aa0"),
        circ(40, -8, 5, INK),
        ell(-6, 34, 40, 5, "rgba(0,0,0,0.15)"),
      ].join(""),
    );
  return mouse(-100, 60, 1.25, p.m) + mouse(70, -10, 1.0, p.a) + mouse(110, 100, 1.1, p.l);
};

export const pets: Record<string, Drawer> = {
  "dog-bed": dogBed,
  "pet-bowl": petBowl,
  leash,
  "chew-bone": chewBone,
  "scratching-post": scratchingPost,
  "cat-toy-mice": catToyMice,
};
