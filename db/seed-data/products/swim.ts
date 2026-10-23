import type { RawSeedProduct } from "../types";

export const swimProducts: RawSeedProduct[] = [
  {
    name: "Splashline Anti-Fog Swim Goggles",
    price: 1699,
    stock: 85,
    art: "goggles",
    hue: 190,
    description:
      "Comfortable swim goggles with an anti-fog coating and UV protection. The soft silicone seal keeps water out, and the adjustable strap suits adults and teens.",
    specs: {
      Lens: "Anti-fog, UV protected",
      Seal: "Soft silicone",
      Strap: "Split, adjustable",
      "Nose bridges": "3 sizes included",
      Fit: "Adult and teen",
    },
  },
  {
    name: "Splashline Silicone Swim Cap",
    price: 1199,
    stock: 70,
    art: "swim-cap",
    hue: 175,
    description:
      "A durable, stretchy silicone cap that keeps hair out of your face and cuts drag in the water. It slips on easily and is gentle enough to avoid pulling hair.",
    specs: {
      Material: "100% silicone",
      Fit: "Adult, fits most heads",
      Colours: "Single colour with stripe",
      Thickness: "0.6 mm",
      Care: "Rinse and dry after use",
    },
  },
  {
    name: "Splashline Foam Kickboard Training Float",
    price: 1999,
    stock: 29,
    art: "kickboard",
    hue: 220,
    description:
      "A buoyant EVA foam kickboard with a contoured grip for leg drills and technique work. It is light, durable and floats high so you can focus on your kick.",
    specs: {
      Size: "46 x 31 cm",
      Material: "Closed-cell EVA foam",
      Thickness: "4 cm",
      Grip: "Contoured hand holes",
      Weight: "190 g",
    },
  },
  {
    name: "Splashline Short Blade Training Fins",
    price: 3499,
    stock: 17,
    art: "fins",
    hue: 310,
    description:
      "Short-blade fins that build leg strength and improve kick technique without strain on the knees. The soft foot pockets and rails give a natural, powerful push.",
    specs: {
      Blade: "Short, vented",
      "Foot pocket": "Soft thermoplastic rubber",
      Sizes: "S, M, L (EU 36 to 46)",
      Use: "Pool training, snorkelling",
      Weight: "540 g per pair",
    },
  },
  {
    name: "Splashline Inflatable Pool Float Ring 1.2m",
    price: 1850,
    stock: 36,
    art: "float-ring",
    hue: 330,
    description:
      "A bright, striped inflatable ring for lazy afternoons in the pool or at the beach. Made of thick, puncture-resistant vinyl with a safety valve for quick inflating.",
    specs: {
      Diameter: "1.2 m",
      Material: "0.3 mm reinforced vinyl",
      "Max load": "100 kg",
      Valve: "Two-way safety valve",
      Includes: "Repair patch",
    },
  },
  {
    name: "Splashline Quick-Dry Microfibre Beach Towel",
    price: 2700,
    stock: 44,
    art: "beach-towel",
    hue: 15,
    description:
      "A big, absorbent beach towel that dries in a fraction of the time of cotton and shakes the sand right off. Folds down small enough to throw in a bag.",
    specs: {
      Size: "180 x 90 cm",
      Material: "Microfibre",
      Drying: "Up to 3x faster than cotton",
      Weight: "420 g",
      Care: "Machine wash cold",
    },
  },
];
