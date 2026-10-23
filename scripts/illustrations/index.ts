import type { Drawer } from "./core";
import { crafts } from "./crafts";
import { electronics } from "./electronics";
import { garden } from "./garden";
import { home } from "./home";
import { kitchen } from "./kitchen";
import { outdoors } from "./outdoors";
import { pets } from "./pets";
import { stationery } from "./stationery";
import { swim } from "./swim";
import { toys } from "./toys";

/** Every illustration, keyed by the `art` value a seed product refers to. */
export const illustrations: Record<string, Drawer> = {
  ...kitchen,
  ...toys,
  ...crafts,
  ...swim,
  ...electronics,
  ...outdoors,
  ...home,
  ...garden,
  ...pets,
  ...stationery,
};
