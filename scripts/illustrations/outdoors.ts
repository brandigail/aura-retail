import { GLOSS, INK, STEEL, STEEL_D, WHITE, circ, ell, group, path, rect, stroke, type Drawer } from "./core";

const yogaMat: Drawer = (p) =>
  [
    path("M150 -62 L-170 -62 Q-190 -62 -190 -42 L-190 42 Q-190 62 -170 62 L150 62 Z", p.m),
    rect(-190, -62, 340, 22, GLOSS, 10),
    ...[-30, 0, 30].map((y) => stroke(`M-160 ${y} L130 ${y}`, "rgba(255,255,255,0.35)", 3)),
    rect(-40, -64, 34, 128, p.a),
    ell(150, 0, 44, 62, p.l),
    ell(150, 0, 34, 50, p.m),
    ell(150, 0, 24, 36, p.l),
    ell(150, 0, 14, 22, p.m),
    ell(150, 0, 5, 9, p.d),
  ].join("");

const dumbbells: Drawer = (p) => {
  const bell = (y: number, s: number, plate: string) =>
    group(
      `translate(0 ${y}) scale(${s})`,
      [
        rect(-120, -13, 240, 26, STEEL, 13),
        rect(-120, -13, 240, 8, "rgba(255,255,255,0.6)", 4),
        rect(-190, -78, 50, 156, plate, 16),
        rect(-142, -56, 26, 112, p.d, 10),
        rect(140, -78, 50, 156, plate, 16),
        rect(116, -56, 26, 112, p.d, 10),
        rect(-190, -78, 50, 22, GLOSS, 14),
        rect(140, -78, 50, 22, GLOSS, 14),
        ...[-110, -84, -58].map((x) => stroke(`M${x} -8 l0 16`, STEEL_D, 3)),
      ].join(""),
    );
  return bell(-60, 0.95, p.m) + bell(86, 0.82, p.a);
};

const tent: Drawer = (p) =>
  [
    ell(0, 140, 215, 22, "#5fa05a", 'opacity="0.55"'),
    stroke("M-90 -40 L-215 128 M90 -40 L215 128", p.d, 3, 'stroke-dasharray="6 6"'),
    circ(-215, 130, 6, STEEL_D),
    circ(215, 130, 6, STEEL_D),
    path("M-190 140 L0 -150 L190 140 Z", p.m),
    path("M0 -150 L190 140 L90 140 L0 -10 Z", p.d, 'opacity="0.55"'),
    path("M-70 140 L0 -26 L70 140 Z", "#161c22"),
    path("M-70 140 L0 -26 L0 140 Z", p.l),
    path("M0 -26 L70 140 L0 140 Z", p.a),
    stroke("M0 -150 L0 -26", INK, 5),
    stroke("M-30 60 L-50 60 M30 60 L50 60", WHITE, 4),
    path("M-150 100 L-100 16", "none", `stroke="${GLOSS}" stroke-width="6" stroke-linecap="round"`),
  ].join("");

const waterBottle: Drawer = (p) =>
  [
    rect(-64, -96, 128, 250, p.m, 36),
    rect(-64, -20, 128, 76, p.a),
    stroke("M-30 8 l12 12 l24 -26", WHITE, 7),
    rect(-34, -128, 68, 44, STEEL_D, 12),
    rect(-44, -168, 88, 46, INK, 14),
    stroke("M-24 -170 Q0 -214 24 -170", INK, 9),
    rect(-44, -168, 88, 12, "rgba(255,255,255,0.18)", 8),
    path("M-50 -80 Q-56 20 -50 120 L-36 120 Q-42 20 -36 -80 Z", GLOSS),
    rect(-64, 118, 128, 12, p.d, 6),
  ].join("");

const backpack: Drawer = (p) =>
  [
    rect(-130, -176, 260, 38, p.a, 19),
    circ(-130, -157, 19, p.d),
    circ(130, -157, 19, p.d),
    rect(-112, -136, 224, 288, p.m, 62),
    rect(-112, -136, 224, 124, p.d, 62),
    stroke("M-60 -12 Q0 22 60 -12", p.l, 6),
    rect(-82, 28, 164, 104, p.l, 22),
    stroke("M-82 56 L82 56", p.d, 4),
    rect(-8, 38, 16, 30, STEEL, 4),
    rect(-130, -10, 20, 140, p.d, 9),
    rect(110, -10, 20, 140, p.d, 9),
    rect(-130, 40, 20, 40, STEEL_D, 6),
    rect(110, 40, 20, 40, STEEL_D, 6),
    path("M-90 -120 Q-100 -60 -90 -20 Q-70 -70 -70 -120 Z", GLOSS),
    stroke("M-30 -136 Q0 -168 30 -136", p.d, 10),
  ].join("");

const helmet: Drawer = (p) => {
  const vents = [-92, -44, 4, 52].map((x) => group(`rotate(-20 ${x} -40)`, `<ellipse cx="${x}" cy="-48" rx="14" ry="52" fill="${INK}" opacity="0.85"/>`)).join("");
  return [
    path("M-176 56 Q-186 -130 0 -140 Q190 -130 176 56 L150 86 Q0 52 -150 86 Z", p.m),
    path("M-176 56 Q-186 -130 0 -140 L0 70 Q-80 70 -150 86 Z", "rgba(255,255,255,0.12)"),
    vents,
    path("M-176 56 Q-170 8 -140 -12 L-140 20 Q-160 40 -150 86 Z", p.d),
    path("M176 56 Q190 28 196 20 L150 -4 L150 86 Z", p.d),
    path("M-120 -110 Q-60 -144 0 -140 Q-70 -126 -112 -80 Z", GLOSS),
    rect(-168, 52, 336, 14, p.a, 7),
    stroke("M-110 76 L-130 150 M110 76 L130 150", p.d, 10),
    rect(-146, 138, 34, 26, STEEL, 6),
    rect(112, 138, 34, 26, STEEL_D, 6),
    stroke("M-112 150 L112 150", p.d, 8),
  ].join("");
};

export const outdoors: Record<string, Drawer> = {
  "yoga-mat": yogaMat,
  dumbbells,
  tent,
  "water-bottle": waterBottle,
  backpack,
  helmet,
};
