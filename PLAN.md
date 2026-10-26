# Aura Retail: Build Plan

- [x] 1. Scaffold Next.js (App Router, TS strict, Tailwind), add lucide-react, Drizzle, `.env.example`, `.gitignore`
- [x] 2. Create the Neon database and set `DATABASE_URL` locally; define Drizzle schema and run the first migration
- [x] 3. Define `types/` interfaces (Product, Review, Order, OrderItem) and a money helper
- [x] 4. Build `Providers` (Theme + Cart) in `app/layout.tsx`; teal design tokens, dark/light toggle with no flash or hydration warnings
- [x] 5. Seed script with 12 to 20 products, specs and reviews; local images in `/public/products`
- [x] 6. Catalog page: grid, category filter, search, sort
- [x] 7. Product page `/products/[id]`: gallery, specs, stock badge, rating breakdown, reviews list
- [x] 8. Review submission (server action or route handler) with validation
- [x] 9. Cart drawer and cart page (quantities, totals, stock limits)
- [x] 10. Mock checkout: create order, decrement stock in one transaction
- [x] 11. Admin login (`ADMIN_PASSWORD`, signed httpOnly cookie) and route protection
- [x] 12. Admin products: create, edit, delete, image path field
- [x] 13. Admin stock adjustments and low-stock list
- [x] 14. Admin orders list and analytics (revenue, orders per day)
- [x] 15. Responsive pass at 375px, accessibility pass, empty and error states
- [x] 16. `npm run build`, lint and `tsc --noEmit` clean; no console errors
- [x] 17. README (pitch, features, stack, architecture, recruiter demo bullets, screenshots)
- [ ] 18. Deploy to Netlify, set env vars, test live; push to GitHub; update root `LINKS.md` (WAITING: only on the owner's explicit go-ahead; nothing is pushed or deployed without asking first)

## Owner-ready phase (added: the store must be complete enough to hand to a real shop owner)

- [x] 19. Store settings in the admin (name, contacts, VAT, shipping rates, Rand rate, announcement bar), DB-backed and cached
- [x] 20. Storefront redesign: announcement bar, hero, category tiles, sale and featured rows, richer footer
- [x] 21. Info pages (About, Contact with inbox, Shipping and returns, Privacy, Terms) and admin Messages
- [x] 22. Checkout upgrade: shipping options, VAT line, discount codes, simulated card payment, order confirmation emails (outbox)
- [x] 23. Admin Discount codes and Emails outbox; order lookup (/track) by order number and email; CSV export of orders
- [x] 24. Wishlist, related products, review moderation, customers list
- [x] 25. Responsive, accessibility and SEO pass (375px, keyboard, metadata, sitemap)
- [x] 26. Owner guide page in the admin (how to run the shop) and Phase 2 production notes (payments, email, domain)
