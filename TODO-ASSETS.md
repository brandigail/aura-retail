# TODO-ASSETS

## Product images

Every seeded product currently has two **generated illustrations** (not photographs):

- `public/products/<slug>/1.svg`: the product on a tinted background
- `public/products/<slug>/2.svg`: a detail card with its name and key specs

They are drawn in code (`scripts/illustrations/`) from each product's name, description and specs, and are rebuilt with `npm run images`. They are good for demoing the store, but a recruiter-ready site would use real product photos.

To replace one with a real photo:

1. Add the file (webp, about 1200x900) under `public/products/<slug>/`, e.g. `1.webp`.
2. In the admin, edit the product and change its image paths (one per line) to point at the new file.

`public/products/placeholder.svg` is the fallback for any product with no images.
