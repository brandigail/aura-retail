import { CREAM, GLOSS, INK, STEEL, WHITE, circ, group, hsl, path, rect, stroke, type Drawer } from "./core";

const GOLD = "#d8b04a";

const notebook: Drawer = (p) =>
  group(
    "rotate(-5)",
    [
      rect(-118, -150, 244, 304, "#e9e3d6", 12),
      rect(-122, -154, 244, 300, p.m, 14),
      rect(-122, -154, 28, 300, p.d, 14),
      rect(-122, -154, 244, 22, GLOSS, 12),
      rect(70, -154, 14, 300, INK),
      rect(-66, -92, 150, 76, CREAM, 8),
      stroke("M-48 -70 L58 -70 M-48 -50 L30 -50", p.d, 5),
      circ(-30, 30, 14, GOLD),
      stroke("M20 150 l0 36 l12 -12 l12 12 l0 -36", p.a, 12),
    ].join(""),
  );

const fountainPen: Drawer = (p) =>
  group(
    "rotate(-34)",
    [
      rect(-196, -20, 276, 40, INK, 20),
      rect(-196, -20, 276, 12, "rgba(255,255,255,0.28)", 8),
      rect(-120, -20, 14, 40, GOLD),
      rect(-196, -22, 40, 44, p.m, 14),
      stroke("M-150 -34 L10 -34", GOLD, 5),
      rect(80, -17, 40, 34, GOLD, 6),
      path("M120 -14 L196 0 L120 14 Z", GOLD),
      path("M120 -14 L196 0 L120 14 Z", "rgba(255,255,255,0.3)"),
      stroke("M130 0 L186 0", INK, 3),
      circ(150, 0, 4, INK),
      circ(-176, 0, 8, GOLD),
    ].join(""),
  ) + path("M126 120 Q134 140 126 152 Q118 140 126 120 Z", p.m);

const pencilSet: Drawer = (p) => {
  const pencil = (angle: number, hue: number) =>
    group(
      `rotate(${angle} 0 72)`,
      [
        rect(-12, -150, 24, 210, hsl(hue, 70, 55), 3),
        rect(-12, -150, 7, 210, "rgba(255,255,255,0.3)"),
        path("M-12 -150 L0 -192 L12 -150 Z", "#e6c28f"),
        path("M-5 -171 L0 -192 L5 -171 Z", hsl(hue, 70, 40)),
        rect(-12, -150, 24, 10, STEEL),
      ].join(""),
    );
  return [
    ...[-32, -23, -14, -5, 5, 14, 23, 32].map((a, i) => pencil(a, 40 * i + 10)),
    rect(-166, 40, 332, 104, p.m, 14),
    rect(-166, 40, 332, 24, GLOSS, 12),
    rect(-166, 40, 332, 8, p.d, 4),
    rect(-60, 80, 120, 36, p.l, 8),
    stroke("M-40 98 L40 98", p.d, 5),
  ].join("");
};

const deskOrganiser: Drawer = (p) => {
  const pen = (x: number, y: number, h: number, c: string, angle: number) =>
    group(`rotate(${angle} ${x} ${y + h})`, rect(x - 7, y, 14, h, c, 5) + rect(x - 7, y, 14, 10, WHITE, 3, 'opacity="0.6"'));
  return [
    pen(-120, -150, 190, p.a, -8),
    pen(-96, -166, 200, hsl(0, 0, 25), 4),
    pen(-72, -140, 180, p.l, 12),
    pen(100, -130, 170, p.d, -10),
    pen(128, -150, 190, p.a, 6),
    rect(-176, -50, 112, 196, p.m, 14),
    rect(-176, -50, 112, 22, GLOSS, 10),
    rect(-54, 6, 116, 140, p.d, 14),
    rect(-44, -34, 96, 56, "#f7d96b", 4),
    rect(-44, -34, 96, 12, "rgba(255,255,255,0.4)", 4),
    rect(72, -40, 104, 186, p.m, 14),
    rect(72, -40, 104, 22, GLOSS, 10),
    rect(-176, 110, 352, 40, p.d, 14),
  ].join("");
};

const highlighters: Drawer = (p) => {
  const colors = [p.m, p.a, hsl(60, 90, 58), hsl(320, 80, 62)];
  const marker = (x: number, angle: number, c: string) =>
    group(
      `translate(${x} 20) rotate(${angle})`,
      [
        rect(-30, -78, 60, 190, WHITE, 12),
        rect(-30, -10, 60, 122, c, 12, 'opacity="0.92"'),
        rect(-30, -78, 60, 66, c, 12),
        rect(-30, -78, 12, 190, "rgba(255,255,255,0.35)", 6),
        rect(-24, 26, 48, 44, WHITE, 6, 'opacity="0.85"'),
        stroke("M-14 48 L14 48", c, 5),
        path("M-26 -78 L-20 -126 L20 -126 L26 -78 Z", INK),
        path("M-20 -126 L-12 -150 L12 -150 L20 -126 Z", c),
      ].join(""),
    );
  return [-132, -44, 44, 132].map((x, i) => marker(x, [-9, -3, 3, 9][i], colors[i])).join("");
};

const stickyNotes: Drawer = (p) => {
  const pad = (dx: number, dy: number, angle: number, c: string) =>
    group(`translate(${dx} ${dy}) rotate(${angle})`, rect(-96, -96, 192, 192, c, 4) + rect(-96, 84, 192, 12, "rgba(0,0,0,0.1)", 2));
  return [
    pad(-70, 20, -10, p.a),
    pad(60, -4, 9, p.l),
    pad(-10, 10, -3, hsl(55, 95, 72)),
    group(
      "translate(-10 10) rotate(-3)",
      [
        stroke("M-62 -48 L50 -48 M-62 -22 L18 -22 M-62 4 L38 4", "rgba(80,60,0,0.45)", 6),
        path("M96 96 L56 96 L96 56 Z", "rgba(255,255,255,0.75)"),
        path("M96 96 L56 96 L96 56 Z", "none", 'stroke="rgba(0,0,0,0.12)" stroke-width="2"'),
        circ(-60, 60, 16, p.m),
        stroke("M-67 60 l5 6 l11 -12", WHITE, 4),
      ].join(""),
    ),
  ].join("");
};

export const stationery: Record<string, Drawer> = {
  notebook,
  "fountain-pen": fountainPen,
  "pencil-set": pencilSet,
  "desk-organiser": deskOrganiser,
  highlighters,
  "sticky-notes": stickyNotes,
};
