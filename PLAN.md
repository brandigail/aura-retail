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
- [ ] 13. Admin stock adjustments and low-stock list
- [ ] 14. Admin orders list and analytics (revenue, orders per day)
- [ ] 15. Responsive pass at 375px, accessibility pass, empty and error states
- [ ] 16. `npm run build`, lint and `tsc --noEmit` clean; no console errors
- [ ] 17. README (pitch, features, stack, architecture, recruiter demo bullets, screenshots)
- [ ] 18. Deploy to Netlify, set env vars, test live; push to GitHub; update root `LINKS.md`
