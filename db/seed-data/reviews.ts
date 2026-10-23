import type { SeedProduct } from "./types";

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
  "Kitchen & Cooking": [
    { rating: 5, title: "Worth every cent", body: "Feels solid and heats evenly. I have used it every day since it arrived and it still looks brand new." },
    { rating: 5, title: "Cooks beautifully", body: "Food comes out better than with my old gear, and it is easy to clean. Would happily buy again." },
    { rating: 4, title: "Great quality", body: "Well made and good value. It is a little heavier than I expected, but that is part of why it works so well." },
    { rating: 4, title: "Does the job", body: "Very pleased overall. The finish has a few marks after a month, but nothing that affects how it cooks." },
    { rating: 3, title: "Good, not great", body: "It works fine, but I expected a bit more for the price. Packaging was excellent and delivery was quick." },
    { rating: 2, title: "Not what I hoped", body: "Mine arrived with a small defect and the instructions were thin. Customer service was helpful, but I was disappointed." },
  ],
  "Toys & Games": [
    { rating: 5, title: "Hit with the kids", body: "My children have played with this nearly every day since we got it. It feels sturdy and well made." },
    { rating: 5, title: "Perfect gift", body: "Bought it as a birthday present and it was a big success. Arrived nicely packed and ready to give." },
    { rating: 4, title: "Lots of fun", body: "Good quality for the price and easy to set up. Lost a star because the instructions could be clearer." },
    { rating: 4, title: "Solid and safe", body: "Feels safe and durable, with no sharp edges. My daughter loves it and plays with it for hours." },
    { rating: 3, title: "Fun but fiddly", body: "Kids enjoyed it once they got going, but some parts are small and a bit fiddly for younger ones." },
    { rating: 1, title: "Broke quickly", body: "One piece snapped within a week of normal play. Disappointing for a toy that is meant to last." },
  ],
  "Knitting & Crafts": [
    { rating: 5, title: "A joy to use", body: "Beautiful quality and so smooth to work with. It has made my projects a lot more enjoyable." },
    { rating: 5, title: "Lovely colours", body: "The colours are even richer in person. It has been a pleasure to craft with and the results look fantastic." },
    { rating: 4, title: "Great for beginners", body: "Easy to start with and good value. I would like a few more options in the set, but I am happy overall." },
    { rating: 4, title: "Comfortable and well made", body: "Feels good in the hand and held up through a long project. A small price for such quality." },
    { rating: 3, title: "Decent", body: "Does what it says. Not quite as soft as I imagined, but fine for everyday projects." },
    { rating: 2, title: "Colour differed", body: "The shade looked different from the pictures. Quality is fine, but it was not the colour I wanted." },
  ],
  "Swimming & Water Sports": [
    { rating: 5, title: "Great in the pool", body: "Comfortable, no leaking and no fogging for the whole session. I swim three times a week and it has held up." },
    { rating: 5, title: "Excellent value", body: "Better than gear I have paid twice as much for. Dries quickly and feels well made." },
    { rating: 4, title: "Comfortable fit", body: "Fits well and does the job. Took a swim or two to get used to, but now I would not switch." },
    { rating: 4, title: "Good for the money", body: "Good quality at a fair price. The colour is a little brighter than expected, which I like." },
    { rating: 3, title: "Fine for casual use", body: "Works well for relaxed swimming. I am not sure it would last through heavy training." },
    { rating: 2, title: "Wore out fast", body: "Started to degrade after a few weeks in chlorine. Fine for occasional use, but not for regular swimmers." },
  ],
  "Sports & Outdoors": [
    { rating: 5, title: "Ready for adventure", body: "Took it out on the weekend and it performed perfectly. Sturdy, comfortable and well thought out." },
    { rating: 5, title: "Excellent quality", body: "Well made from good materials. It has already been through a few trips with no problems at all." },
    { rating: 4, title: "Very good", body: "Does everything I need at a great price. A couple of minor finishing details could be better." },
    { rating: 4, title: "Solid purchase", body: "Feels durable and works as described. Slightly heavier than the specs suggested but still great." },
    { rating: 3, title: "Okay", body: "Fine for casual use. The fit and finish are decent but nothing special for the price." },
    { rating: 2, title: "Expected more", body: "It did the job, but one strap came loose on the first trip. The seller refunded part of the cost." },
  ],
  "Home & Living": [
    { rating: 5, title: "Looks gorgeous", body: "Even nicer than the photos. It instantly made the room feel warmer and more finished." },
    { rating: 5, title: "Lovely quality", body: "Beautifully made and arrived perfectly packed. Everyone who visits asks where it is from." },
    { rating: 4, title: "Great addition", body: "Looks lovely and feels well made. The colour is a touch different in the evening light." },
    { rating: 4, title: "Happy with it", body: "Good value and a nice finish. Would have liked a slightly bigger size, but I am pleased." },
    { rating: 3, title: "Nice but small", body: "Pretty and well made, but a bit smaller than I pictured. Worth checking the dimensions first." },
    { rating: 2, title: "Arrived scuffed", body: "Mine had a scuff on arrival. The seller offered a replacement but I kept it. Pretty, but not perfect." },
  ],
  "Garden & DIY": [
    { rating: 5, title: "Works like a charm", body: "Used it all weekend on the garden and it did everything I asked. Feels sturdy and built to last." },
    { rating: 5, title: "Great quality for the price", body: "Better built than I expected and comfortable to use for hours. A real bargain." },
    { rating: 4, title: "Reliable", body: "Does what it should. A good buy for home projects, and it has held up well so far." },
    { rating: 4, title: "Good all-rounder", body: "Handy and well made. Wish it came with a few more accessories, but it works great." },
    { rating: 3, title: "Fine for light jobs", body: "Fine for around the house. I would not rely on it for heavy daily use." },
    { rating: 2, title: "Fell short", body: "It struggled with tougher jobs and the finish chipped quickly. Fine for light use only." },
  ],
  "Pet Supplies": [
    { rating: 5, title: "My pet loves it", body: "Took to it right away and has used it every day since. Well made and easy to keep clean." },
    { rating: 5, title: "Tough and safe", body: "Stands up to a lot of rough use and feels safe. Great quality for the price." },
    { rating: 4, title: "Very happy", body: "Good size and sturdy. It took a day or two for my pet to warm up to it, but now it is a favourite." },
    { rating: 4, title: "Good value", body: "Well made and easy to wash. A touch smaller than I expected, so check the measurements." },
    { rating: 3, title: "Okay", body: "Does the job, though my pet lost interest after a couple of weeks. Quality is fine." },
    { rating: 2, title: "Chewed through", body: "My dog destroyed it in a few days. Might suit gentler pets, but not strong chewers." },
  ],
  "Stationery & Office": [
    { rating: 5, title: "A pleasure to use", body: "Smooth, neat and well made. It has become my favourite thing on my desk." },
    { rating: 5, title: "Great quality", body: "Wonderful to write with and looks great too. Excellent value for what you get." },
    { rating: 4, title: "Lovely", body: "Good quality and nicely finished. I would give five stars if there were a couple more options." },
    { rating: 4, title: "Does exactly what I need", body: "Reliable and tidy. Handy for work and study, and priced well." },
    { rating: 3, title: "Decent", body: "Fine for everyday use, though I have seen slightly nicer for a little more." },
    { rating: 2, title: "Not for me", body: "Looked better than it performed. Ink showed through the page, which was a letdown." },
  ],
  Electronics: [
    { rating: 5, title: "Fast and reliable", body: "Installed without a hitch and the performance is excellent. Easily the best upgrade I have made." },
    { rating: 5, title: "Excellent quality", body: "Runs cool and quiet, and the build quality is great. Very happy with the purchase." },
    { rating: 4, title: "Great value", body: "Performance is excellent for the price. Only wish the packaging included a few more extras." },
    { rating: 4, title: "Solid", body: "Works exactly as described. Setup took some patience, but it has been stable since." },
    { rating: 3, title: "Good, but check compatibility", body: "Works well, but make sure it fits your setup first. I needed an update before it was recognised." },
    { rating: 2, title: "Faulty unit", body: "My unit had intermittent problems and needed replacing. The replacement works, but it was a hassle." },
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
    if (pool.length === 0) return;
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
