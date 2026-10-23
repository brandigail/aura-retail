# Aura Retail: E-Commerce Platform (REBUILD FROM SCRATCH)

Read the portfolio-root `CLAUDE.md` first for global rules. This file is the brief for this project.

## What it is
A hardware-focused online store with product pages, reviews, a cart, and an admin dashboard for catalog, stock and order analytics. Teal accent (#008080), dark/light theme. The old version is broken; don't reuse its code.

## Stack
Next.js (App Router), TypeScript strict, Tailwind CSS, lucide-react, React Context (cart, theme), Neon Postgres via Drizzle ORM, hosted on Netlify. No Vercel, no Supabase.

## MVP (build first)
1. Catalog grid with category filter, search and sort, plus product page `/products/[id]` (image gallery, specs table, stock status, rating breakdown, reviews list, review form).
2. Cart (Context, persisted after mount only) and a mock checkout that writes an order to Neon and decrements stock. No real payments.
3. Admin dashboard `/admin` (protected by `ADMIN_PASSWORD` env var and a signed httpOnly cookie): add/edit/delete products, adjust stock, view orders, simple analytics (revenue, orders per day, low-stock list).

## Phase 2
Order lookup by email, wishlist, discount codes, CSV export of orders.

## Data model (put in `types/`)
- `Product { id, slug, name, category, price, stock, description, specs: Record<string,string>, images: string[] }`
- `Review { id, productId, author, rating (1-5), title, body, createdAt }`
- `Order { id, email, items: OrderItem[], total, status, createdAt }`
- `OrderItem { productId, name, unitPrice, qty }`

## Rules specific to this project
- All product images live locally under `/public/products/<slug>/` (webp). Never hotlink; never substitute random stock images for specific hardware. Missing images go in `TODO-ASSETS.md` with a local placeholder.
- `ThemeProvider` and `CartProvider` are mounted once in a client `Providers` component in `app/layout.tsx`. No localStorage reads during render. Zero hydration warnings, and no theme flash (inline theme init script).
- `npm run seed` inserts 12 to 20 products with specs and a few reviews each.
- Money is stored as integer cents; format in one helper.

## Start here
1. Ask me for the product list (names, specs, prices) and the image files for `/public/products`. If I don't have them yet, seed placeholder products and log the missing images.
2. Work through `PLAN.md` from step 1.
