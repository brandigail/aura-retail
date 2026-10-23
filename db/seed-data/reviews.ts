import type { SeedProduct } from "./products";

export interface SeedReview {
  productSlug: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  createdAt: Date;
}

interface Snippet {
  rating: number;
  title: string;
  body: string;
}

/** Category-level review pools so every product gets plausible, varied feedback. */
const snippets: Record<string, Snippet[]> = {
  Processors: [
    { rating: 5, title: "Huge upgrade", body: "Dropped straight into my board after a BIOS update. Builds and games are both noticeably faster." },
    { rating: 5, title: "Runs cooler than expected", body: "Temperatures stay reasonable under a decent cooler, even in long rendering sessions." },
    { rating: 4, title: "Great value", body: "Performance is excellent for the price. Only wish the retail box shipped with a better stock cooler." },
    { rating: 4, title: "Solid all-rounder", body: "Fast for work and play. Idle power draw is a little higher than my old chip." },
    { rating: 3, title: "Good, but needs a BIOS update", body: "Had to flash the BIOS before it would boot. Fine once updated, but check your board first." },
  ],
  "Graphics Cards": [
    { rating: 5, title: "Smooth at my target resolution", body: "Every game I tried holds a steady frame rate at high settings, and the fans stay quiet." },
    { rating: 5, title: "Build quality is excellent", body: "Sturdy backplate, no coil whine, and the cooler keeps temps well under control." },
    { rating: 4, title: "Fast, but check clearance", body: "Performance is great. Measure your case first; it is longer than it looks in the photos." },
    { rating: 4, title: "Quiet under load", body: "Fan curve is gentle and thermals are good. Driver install was painless." },
    { rating: 3, title: "Power hungry", body: "Plenty fast, but make sure your power supply has the right connector and enough headroom." },
  ],
  Memory: [
    { rating: 5, title: "Booted at rated speed first try", body: "Enabled the profile in the BIOS and it ran at full speed with no stability issues." },
    { rating: 5, title: "Clean and low profile", body: "Fits under my air cooler with room to spare. Looks neat and runs stable." },
    { rating: 4, title: "Good kit", body: "Passes memory tests overnight with no errors. Initial boot took a while while it trained." },
    { rating: 4, title: "Easy upgrade", body: "Swapped in for my old kit and the system feels snappier in multitasking." },
    { rating: 3, title: "Slow first boot", body: "Works fine now, but the first boot with the profile enabled took several minutes." },
  ],
  Storage: [
    { rating: 5, title: "Blazing fast", body: "Boot times and game loads dropped dramatically. Benchmarks match the advertised speeds." },
    { rating: 5, title: "Reliable so far", body: "Months of daily use without a hiccup, and temperatures stay in check." },
    { rating: 4, title: "Great for the money", body: "Excellent speed for the price. Sustained writes slow down once the cache is full, as expected." },
    { rating: 4, title: "Simple install", body: "Cloned my old drive and was running in minutes. Included screw made it tool-free." },
    { rating: 3, title: "Runs warm without a heatsink", body: "Fast, but it throttled in my small case until I added a heatsink." },
  ],
  Motherboards: [
    { rating: 5, title: "Everything just worked", body: "Stable from the first boot, WiFi and ethernet drivers installed cleanly, and the BIOS is easy to navigate." },
    { rating: 5, title: "Plenty of M.2 slots", body: "Room to grow on storage, and the heatsinks are easy to remove." },
    { rating: 4, title: "Good features for the price", body: "Strong power delivery and solid I/O. Fan header placement could be better." },
    { rating: 4, title: "Smooth build", body: "Clear labelling and good layout made installation easy." },
    { rating: 3, title: "BIOS needed updating", body: "Needed a flash before my CPU was recognised. Fine afterwards, but check compatibility first." },
  ],
  Cooling: [
    { rating: 5, title: "Quiet and effective", body: "Dropped my temperatures by a big margin, and I can barely hear the fans under load." },
    { rating: 5, title: "Easy to install", body: "Clear instructions and well-made brackets. Mounted in under twenty minutes." },
    { rating: 4, title: "Good cooling for the price", body: "Handles my chip comfortably. Fans ramp up a little during sudden load spikes." },
    { rating: 4, title: "Clean look", body: "Tidy cabling and a simple design. Check your case's radiator or height clearance." },
    { rating: 3, title: "Slight pump hum", body: "Cools well, but I can hear a faint hum at idle. Not a dealbreaker." },
  ],
  "Power Supplies": [
    { rating: 5, title: "Quiet and stable", body: "Fan barely spins at normal loads, and the modular cables made cable management easy." },
    { rating: 5, title: "Great warranty", body: "Solid build quality and a long warranty give me confidence for a long-term build." },
    { rating: 4, title: "Good efficiency", body: "Runs cool and efficient. Cables are a little stiff but sleeved well." },
    { rating: 4, title: "Plenty of connectors", body: "Enough headroom for my graphics card and drives with no adapters needed." },
    { rating: 3, title: "Cables could be longer", body: "Works perfectly, but the cables only just reached in my full-tower case." },
  ],
  Peripherals: [
    { rating: 5, title: "Feels fantastic", body: "Great build quality and the battery lasts far longer than the spec suggests." },
    { rating: 5, title: "Reliable wireless", body: "Never dropped a connection, and switching between devices is instant." },
    { rating: 4, title: "Comfortable for long sessions", body: "Nice shape and weight. The companion software is basic but does the job." },
    { rating: 4, title: "Very good for the price", body: "Feels like it should cost more. Included cable is a bit short." },
    { rating: 3, title: "Software could be better", body: "Hardware is great, but the configuration app is clunky and the profiles reset once." },
  ],
};

const authors = [
  "Thandi M.", "Liam O.", "Priya S.", "Marcus B.", "Aisha K.", "Jonas L.", "Sofia R.",
  "Daniel W.", "Nomsa D.", "Ethan P.", "Chloe T.", "Rahul V.", "Megan H.", "Kabelo N.",
];

const DAY_MS = 24 * 60 * 60 * 1000;

/** Deterministic, so re-running the seed produces the same data. */
export function buildSeedReviews(products: SeedProduct[], now = new Date()): SeedReview[] {
  const reviews: SeedReview[] = [];
  products.forEach((product, productIndex) => {
    const pool = snippets[product.category] ?? [];
    const count = 3 + (productIndex % 3); // 3 to 5 reviews per product
    for (let i = 0; i < count; i++) {
      const snippet = pool[(productIndex + i) % pool.length];
      const daysAgo = 3 + ((productIndex * 7 + i * 13) % 85);
      reviews.push({
        productSlug: product.slug,
        author: authors[(productIndex * 3 + i * 5) % authors.length],
        rating: snippet.rating,
        title: snippet.title,
        body: snippet.body,
        createdAt: new Date(now.getTime() - daysAgo * DAY_MS),
      });
    }
  });
  return reviews;
}
