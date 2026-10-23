import { GLOSS, SHADE, STEEL, STEEL_D, WHITE, WOOD, WOOD_D, circ, ell, group, path, rect, stroke, type Drawer } from "./core";

const skillet: Drawer = (p) =>
  [
    path("M118 38 L208 8 Q222 5 222 20 L218 40 Q215 50 204 54 L124 90 Z", p.d),
    circ(204, 28, 6, "rgba(255,255,255,0.55)"),
    ell(-20, 66, 152, 66, p.m),
    ell(-20, 58, 132, 52, "#262d35"),
    ell(-30, 50, 104, 38, "rgba(255,255,255,0.07)"),
    ell(-30, 64, 52, 24, WHITE),
    circ(-30, 60, 15, "#f4b53a"),
    circ(-34, 55, 5, "rgba(255,255,255,0.7)"),
    stroke("M-150 66 Q-140 118 -20 126", GLOSS, 6),
  ].join("");

const saucepans: Drawer = (p) => {
  const pot = (x: number, w: number, top: number, h: number) =>
    [
      rect(x, top, w, h, STEEL, 14),
      rect(x, top + 40, w, 22, p.m),
      rect(x + 12, top + 6, 10, h - 12, GLOSS, 5),
      path(`M${x - 6} ${top} Q${x + w / 2} ${top - 58} ${x + w + 6} ${top} Z`, STEEL_D),
      circ(x + w / 2, top - 38, 11, p.d),
    ].join("");
  return [
    rect(166, 52, 60, 14, p.d, 7),
    pot(36, 140, 20, 120),
    rect(-254, 26, 74, 16, p.d, 8),
    pot(-180, 210, -10, 150),
  ].join("");
};

const chefKnife: Drawer = (p) =>
  group(
    "rotate(-18) translate(0 10)",
    [
      path("M70 -34 L-205 -6 Q-120 46 70 28 Z", STEEL),
      path("M70 -34 L-205 -6 L-160 -4 L70 -20 Z", "rgba(255,255,255,0.5)"),
      path("M-200 -4 Q-110 34 70 26", "none", `stroke="${STEEL_D}" stroke-width="3"`),
      rect(62, -36, 16, 66, STEEL_D, 4),
      rect(78, -32, 140, 58, p.d, 18),
      rect(78, -32, 140, 20, GLOSS, 10),
      circ(110, -3, 7, STEEL),
      circ(150, -3, 7, STEEL),
      circ(190, -3, 7, STEEL),
    ].join(""),
  );

const dutchOven: Drawer = (p) =>
  [
    rect(-196, 6, 46, 20, p.d, 10),
    rect(150, 6, 46, 20, p.d, 10),
    path("M-152 0 Q-152 142 0 142 Q152 142 152 0 Z", p.m),
    path("M-152 0 Q-152 60 -110 100 Q-132 40 -112 0 Z", GLOSS),
    path("M-166 0 Q0 -96 166 0 Z", p.d),
    path("M-120 -12 Q-70 -62 -20 -66 Q-90 -48 -120 -12 Z", GLOSS),
    rect(-170, -8, 340, 18, p.m, 9),
    rect(-14, -92, 28, 22, STEEL_D, 6),
    circ(0, -100, 17, STEEL),
  ].join("");

const mixingBowls: Drawer = (p) => {
  const bowl = (x: number, y: number, w: number, h: number, fill: string) =>
    [
      path(`M${x - w} ${y} A${w} ${h} 0 0 0 ${x + w} ${y} Z`, fill),
      path(`M${x - w + 14} ${y + 10} A${w - 14} ${h - 14} 0 0 0 ${x - w * 0.25} ${y + h - 6} Q${x - w * 0.8} ${y + h * 0.6} ${x - w + 14} ${y + 10} Z`, GLOSS),
      ell(x, y, w, w * 0.17, "rgba(255,255,255,0.45)"),
      ell(x, y + 2, w - 10, w * 0.13, SHADE),
    ].join("");
  return [bowl(-80, 10, 124, 114, p.m), bowl(60, 62, 98, 88, p.a), bowl(150, 96, 62, 54, p.l)].join("");
};

const cuttingBoard: Drawer = () =>
  group(
    "translate(0 24) rotate(-7)",
    [
      rect(-180, -100, 360, 200, WOOD, 30),
      rect(-180, 84, 360, 16, WOOD_D, 8),
      ...[-60, -20, 25, 70].map((y) => stroke(`M-150 ${y} Q-20 ${y - 10} 150 ${y + 4}`, "rgba(138,90,44,0.45)", 3)),
      rect(112, -66, 44, 18, "rgba(40,25,10,0.55)", 9),
      circ(-80, -10, 36, "#f08a2a"),
      circ(-80, -10, 26, "#f7a54f"),
      circ(10, 30, 36, "#f08a2a"),
      circ(10, 30, 26, "#f7a54f"),
      path("M-60 -70 q30 -30 60 0 q-30 10 -60 0 Z", "#5aa65a"),
      path("M40 -60 q35 -34 66 -2 q-34 12 -66 2 Z", "#4c9a52"),
      rect(-180, -100, 360, 24, "rgba(255,255,255,0.18)", 20),
    ].join(""),
  );

export const kitchen: Record<string, Drawer> = {
  skillet,
  saucepans,
  "chef-knife": chefKnife,
  "dutch-oven": dutchOven,
  "mixing-bowls": mixingBowls,
  "cutting-board": cuttingBoard,
};
