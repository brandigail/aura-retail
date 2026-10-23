import type { RawSeedProduct } from "../types";

export const petsProducts: RawSeedProduct[] = [
  {
    name: "Pawsome Orthopaedic Dog Bed, Large",
    price: 6499,
    stock: 13,
    art: "dog-bed",
    hue: 110,
    description:
      "A supportive memory-foam dog bed with raised bolster sides for resting heads. The non-slip base keeps it in place, and the cover zips off for washing.",
    specs: {
      Size: "100 x 70 x 18 cm",
      Filling: "Memory foam",
      Cover: "Removable, machine washable",
      Base: "Non-slip",
      "Suits dogs up to": "35 kg",
    },
  },
  {
    name: "Pawsome Stainless Steel Pet Bowl 900ml",
    price: 1399,
    stock: 80,
    art: "pet-bowl",
    hue: 150,
    description:
      "A sturdy stainless-steel bowl with a silicone base that stops sliding. It is rust-proof, easy to clean and big enough for dry food or water.",
    specs: {
      Capacity: "900 ml",
      Material: "Stainless steel",
      Base: "Non-slip silicone",
      Care: "Dishwasher safe",
      "Suits": "Dogs and cats",
    },
  },
  {
    name: "Pawsome Padded Dog Collar & Leash Set",
    price: 2499,
    stock: 37,
    art: "leash",
    hue: 205,
    description:
      "A soft, padded collar and a strong 1.5 m leash that match. Reflective stitching keeps your dog visible on evening walks, and the metal buckle is built to last.",
    specs: {
      "Collar size": "M, fits necks 34 to 50 cm",
      "Leash length": "1.5 m",
      Material: "Padded nylon",
      Safety: "Reflective stitching",
      Hardware: "Rust-resistant metal",
    },
  },
  {
    name: "Pawsome Natural Rubber Chew Bone",
    price: 999,
    stock: 100,
    art: "chew-bone",
    hue: 260,
    description:
      "A tough natural rubber bone for strong chewers. The textured surface helps clean teeth, and it bounces unpredictably for fetch.",
    specs: {
      Length: "18 cm",
      Material: "Natural rubber, non-toxic",
      Texture: "Ridged for dental care",
      "Suits": "Medium and large dogs",
      Care: "Rinse with warm water",
    },
  },
  {
    name: "Pawsome Sisal Cat Scratching Post 60cm",
    price: 3499,
    stock: 5,
    art: "scratching-post",
    hue: 300,
    description:
      "A sturdy sisal-wrapped scratching post with a weighted base and a hanging toy. It saves your furniture and gives cats a place to stretch, scratch and play.",
    specs: {
      Height: "60 cm",
      "Post diameter": "9 cm",
      Material: "Natural sisal rope",
      Base: "Weighted, 40 x 40 cm",
      Includes: "Hanging toy ball",
    },
  },
  {
    name: "Pawsome Catnip Mice Toys (3 pcs)",
    price: 899,
    stock: 150,
    art: "cat-toy-mice",
    hue: 340,
    description:
      "Three soft little mice filled with real catnip. They are just the right size for batting, carrying and pouncing, and they keep cats busy for hours.",
    specs: {
      Pieces: "3 mice",
      Filling: "Organic catnip",
      Fabric: "Soft felt",
      Length: "7 cm each",
      "Suits": "Cats and kittens",
    },
  },
];
