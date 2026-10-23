import { GLOSS, INK, STEEL, WHITE, circ, ell, group, path, rect, stroke, type Drawer } from "./core";

const goggles: Drawer = (p) =>
  [
    rect(-210, -14, 70, 26, INK, 13),
    rect(140, -14, 70, 26, INK, 13),
    stroke("M-140 0 C-230 -40 -230 60 -190 80", p.d, 18),
    stroke("M140 0 C230 -40 230 60 190 80", p.d, 18),
    rect(-30, -18, 60, 24, p.d, 10),
    ell(-88, 4, 90, 70, p.m),
    ell(88, 4, 90, 70, p.m),
    ell(-88, 4, 72, 54, "rgba(20,40,60,0.85)"),
    ell(88, 4, 72, 54, "rgba(20,40,60,0.85)"),
    ell(-88, 4, 72, 54, p.l, 'opacity="0.35"'),
    ell(88, 4, 72, 54, p.l, 'opacity="0.35"'),
    path("M-136 -10 Q-110 -44 -70 -42 Q-110 -30 -128 8 Z", "rgba(255,255,255,0.7)"),
    path("M40 -10 Q66 -44 106 -42 Q66 -30 48 8 Z", "rgba(255,255,255,0.7)"),
  ].join("");

const swimCap: Drawer = (p) =>
  [
    path("M-156 96 Q-166 -120 0 -126 Q166 -120 156 96 Q0 140 -156 96 Z", p.m),
    path("M-156 96 Q0 140 156 96 L150 74 Q0 116 -150 74 Z", p.d),
    stroke("M-110 70 Q-100 -70 0 -92", p.a, 14, 'opacity="0.9"'),
    stroke("M-70 80 Q-62 -40 6 -70", p.l, 10, 'opacity="0.9"'),
    stroke("M110 70 Q100 -70 0 -92", p.a, 14, 'opacity="0.9"'),
    path("M-120 -20 Q-96 -92 -30 -108 Q-90 -80 -120 -20 Z", GLOSS),
    circ(0, -130, 6, p.d),
  ].join("");

const kickboard: Drawer = (p) =>
  group(
    "rotate(-16)",
    [
      path("M-104 150 L-104 -60 Q-104 -156 0 -156 Q104 -156 104 -60 L104 150 Z", p.m),
      path("M-104 150 L-104 -60 Q-104 -156 0 -156 L0 150 Z", "rgba(255,255,255,0.14)"),
      rect(-104, -10, 208, 36, p.a),
      rect(-104, 60, 208, 14, p.l),
      ell(-40, 100, 20, 30, INK, 'opacity="0.55"'),
      ell(40, 100, 20, 30, INK, 'opacity="0.55"'),
      circ(0, -98, 20, WHITE, 'opacity="0.85"'),
      path("M-60 -150 Q-96 -120 -98 -80 Q-80 -118 -50 -146 Z", GLOSS),
    ].join(""),
  );

const fins: Drawer = (p) => {
  const fin = (x: number, angle: number, color: string, trim: string) =>
    group(
      `translate(${x} 0) rotate(${angle})`,
      [
        path("M-46 -60 L46 -60 L66 30 Q80 130 0 156 Q-80 130 -66 30 Z", color),
        stroke("M-58 -40 Q-74 60 -46 138", trim, 9),
        stroke("M58 -40 Q74 60 46 138", trim, 9),
        ...[-22, 0, 22].map((rx) => stroke(`M${rx} -20 L${rx * 1.5} 140`, "rgba(0,0,0,0.18)", 5)),
        path("M-40 -150 Q-48 -150 -50 -110 L-46 -60 L46 -60 L50 -110 Q48 -150 40 -150 Z", INK),
        path("M-28 -140 Q0 -120 28 -140 L24 -100 Q0 -88 -24 -100 Z", "#3d4a58"),
        stroke("M-44 -112 Q0 -80 44 -112", STEEL, 7),
        path("M-60 -10 Q-76 50 -56 110 Q-66 40 -46 -10 Z", GLOSS),
      ].join(""),
    );
  return fin(-96, -7, p.m, p.d) + fin(96, 7, p.a, p.d);
};

const floatRing: Drawer = (p) => {
  const ringPath = "M-168 0 a168 168 0 1 0 336 0 a168 168 0 1 0 -336 0 Z M-70 0 a70 70 0 1 1 140 0 a70 70 0 1 1 -140 0 Z";
  const wedges = Array.from({ length: 12 }, (_, i) => {
    const a1 = (i * 30 * Math.PI) / 180;
    const a2 = ((i * 30 + 15) * Math.PI) / 180;
    const pt = (r: number, a: number) => `${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`;
    return path(`M${pt(60, a1)} L${pt(180, a1)} L${pt(180, a2)} L${pt(60, a2)} Z`, i % 2 ? WHITE : p.a);
  }).join("");
  return group(
    "translate(0 40) scale(1 0.62)",
    [
      `<defs><clipPath id="ring"><path d="${ringPath}" clip-rule="evenodd"/></clipPath></defs>`,
      path(ringPath, p.m, 'fill-rule="evenodd"'),
      `<g clip-path="url(#ring)">${wedges}</g>`,
      path("M-150 -40 A168 168 0 0 1 -30 -150 L-30 -130 A140 140 0 0 0 -130 -34 Z", GLOSS),
    ].join(""),
  );
};

const beachTowel: Drawer = (p) => {
  const towel = (y: number, color: string, stripe: string) =>
    [
      rect(-176, y, 352, 62, color, 14),
      ...[-130, -60, 10, 80].map((x) => rect(x, y, 34, 62, stripe)),
      rect(-176, y, 352, 20, GLOSS, 12),
      ...Array.from({ length: 20 }, (_, i) => stroke(`M${-166 + i * 17} ${y + 62} l0 12`, color, 3)),
    ].join("");
  return [towel(-90, p.m, p.l), towel(-20, p.a, WHITE), towel(50, p.d, p.m)].join("");
};

export const swim: Record<string, Drawer> = {
  goggles,
  "swim-cap": swimCap,
  kickboard,
  fins,
  "float-ring": floatRing,
  "beach-towel": beachTowel,
};
