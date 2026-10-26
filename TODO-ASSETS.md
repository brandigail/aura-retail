# TODO-ASSETS

## Product images

Every product has real photographs (Pixabay licence), saved as `public/products/<slug>/photo-1.webp` and `photo-2.webp` (1200x900); the fins and the velvet cushion have only one. Credits are in `IMAGE-CREDITS.md`.

These are the closest available match rather than the exact item, so replace them first with your own shots:

- `inkwell-pastel-highlighters-4-pcs` (a single orange highlighter, not a pastel set)
- `splashline-silicone-swim-cap` (a child in a cap, no product shot)
- `hearth-nesting-mixing-bowls-3-pcs` (glass bowl of marshmallows, not steel nesting bowls)
- `pawsome-padded-dog-collar-leash-set` (a puppy on a leash)
- `trail-35l-hiking-backpack` (a backpack silhouette at sunset)
- `inkwell-a5-hardcover-notebook-dotted` (a plain hardcover, no dot grid)
- `inkwell-mesh-desk-organiser` (a pencil pot, not a mesh organiser)

To replace one: add a webp under `public/products/<slug>/`, then edit the product in the admin and change its image paths (one per line).

`public/products/placeholder.svg` is the fallback for any product with no images.
