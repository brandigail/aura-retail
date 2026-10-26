# Aura Retail

A complete online shop that the owner runs entirely from their own admin: products, stock, sales, discount codes, orders, customers, emails and settings, with no third-party store platform in the middle. It is a working template for a small retailer, built to replace a hosted shop builder.

**Live demo:** not deployed yet (kept local until approved) · **Status:** feature-complete template

> Card payments in this version are a clearly labelled demonstration that only accepts a test card. See *Phase 2* for what a production launch adds.

## What to demo to a recruiter

1. **The shopper journey.** Browse and filter 60 products with real photos, save favourites to a wishlist, add to cart, pick delivery, apply the code `WELCOME10`, pay with the test card `4242 4242 4242 4242`, and watch the order appear under **Your orders** with a progress tracker. Switch the whole shop between dollars, Rands or both from the header, including VAT.
2. **The owner's control panel** at `/admin` (password from `ADMIN_PASSWORD`). A dashboard with sales, VAT and best sellers; mark an order shipped and the customer is emailed; put a whole category on sale in two clicks; create discount codes; read and reply to messages; change the store name, delivery prices and VAT and see the shop update instantly.
3. **Engineering quality.** One pricing function shared by browser and server, atomic order creation with stock protection, an email outbox with real SMTP delivery and failure recovery, and an automated accessibility audit with zero violations across every page in light and dark mode at desktop and phone width.

## Features

**Shoppers**
- Catalog with category filter, search, sort, sale prices and ratings; product pages with gallery, specs, reviews, related products and structured data for search engines
- Cart drawer and page with stock limits; wishlist with header count
- Checkout: delivery options (standard, express, free over a threshold), discount codes, VAT shown, card (demo) or bank transfer (EFT) with the owner's bank details
- Order pages with status and progress; **Your orders** shows orders from this device automatically, with an email lookup for other devices
- Dollars, Rands or both everywhere, remembered per visitor
- Contact form, About, Shipping and returns, Privacy (POPIA) and Terms pages; light and dark theme; works from 375px up

**Owner (`/admin`)**
- Dashboard: revenue, VAT, orders, average order, bank transfers waiting, low stock, best sellers, daily sales chart
- Orders with a status workflow (cancelling restores stock), customers, CSV export for the accountant (formula-injection safe)
- Products, stock adjustments, bulk percentage sales, discount codes with limits and expiry
- Messages inbox, review moderation, email outbox with previews and *Send now*
- Store settings (name, contact, announcement bar, VAT, delivery prices, bank details, exchange rate) and a plain-language owner guide

## Tech stack

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript (strict, no `any`) · Tailwind CSS 4 · Neon Postgres with Drizzle ORM · Nodemailer (any SMTP provider) · lucide-react. Built for Netlify; no Supabase, Vercel or paid services.

## Architecture notes

- **One source of truth for money.** All amounts are integer cents. `lib/order-pricing.ts` prices an order and is used by the checkout preview *and* the server when the order is placed, so the two cannot disagree. The browser never decides a total.
- **Orders are atomic.** The order, its items, every stock decrement and the discount-code use run in one database batch; a failed stock or code-limit check rolls everything back. Cancelling restores stock in the same way.
- **Owner-editable settings** are cached with a tag (`"use cache"` + `cacheTag`) and refreshed instantly with `updateTag` when saved, so the shop is fast and edits still appear immediately.
- **Emails never block an order.** Every email is stored in an outbox with its HTML and text versions, then delivered over SMTP; failures are recorded with the provider's reason and can be retried.
- **Privacy by design.** Orders are opened by an unguessable link; "Your orders" keeps those links on the shopper's device; the email lookup answers identically whether or not orders exist and is rate-limited.
- **Security.** Signed httpOnly admin cookie checked in the proxy *and* in every page, action and route; honeypot fields use names browsers will not autofill and never silently drop a real message; real card numbers are refused so no card data is handled; CSV cells that could run as formulas are neutralised.
- **Accessibility.** Skip link, landmarks, labelled forms, visible focus, keyboard-friendly controls, contrast-checked colours (a deeper teal is used for text, `#008080` for fills).

## Run locally

```bash
npm install
cp .env.example .env.local        # then fill in the values below
npm run db:migrate                # create the tables in your Neon database
npm run seed                      # 60 products, reviews and photos (wipes existing shop data; use on an empty database)
npm run seed:store                # starter settings and discount codes
npm run seed:orders               # optional: 50 demo orders so the dashboard looks alive
npm run dev                       # http://localhost:3000
```

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL`, `DATABASE_URL_UNPOOLED` | Neon connection strings (pooled for the app, unpooled for migrations) |
| `ADMIN_PASSWORD`, `SESSION_SECRET` | Owner login and the secret that signs the login cookie |
| `SITE_URL` | Public address, used in emails, sitemap and social previews |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` | Optional. Real email delivery; without them emails are only recorded in the admin |

Other scripts: `npm run build`, `npm run lint`, `npm run db:generate`, `npm run db:studio`.

## Quality checks

`npm run build`, `npm run lint` and `tsc --noEmit` all pass. Beyond that, the shop was driven in real Chrome (production build, light and dark, desktop and 375px) for: the full checkout with a declined card, bad codes and EFT; order tracking and "Your orders"; the wishlist; discount codes and limits; CSV export; real email delivery against a local mail server, including a provider that refuses; and an axe-core accessibility audit of every public and admin page with zero violations.

## Phase 2 (for a real launch)

- Real card payments through a South African provider such as PayFast or Stripe (needs a business account; per-sale fees apply)
- Customer accounts so orders follow shoppers across devices
- Delivery prices and VAT by country; live exchange rates
- Upload photos from the admin instead of adding files

## Screenshots

Placeholders: storefront home, product page, checkout, Your orders, admin dashboard, admin orders. *(Add images to `docs/screenshots/`.)*

Product photographs are from Pixabay under its free licence; see [IMAGE-CREDITS.md](IMAGE-CREDITS.md). A few are close matches rather than the exact item; see [TODO-ASSETS.md](TODO-ASSETS.md).
