# SFGT supplier homepage preview

This is the latest reviewed homepage direction, saved alongside the Next.js website. It includes Toshiba products, Tekbatt, commodities, English/Arabic copy, scroll animation, generated imagery and animated floating WhatsApp/call icons for **+971 50 342 0157**.

The selected design is also the homepage of the Next.js application in `src/`, at `/` and `/ar`. The original preview remains here as its reviewed source. Its generated markup and referenced assets are synchronized with `python3 scripts/sync-supplier-home.py`; `corporate-refinement.css` is copied to `supplier-home-refinement.css` by the same command. Base scoped styling and React lifecycle behavior live in `src/features/landing/supplier-home.css` and `supplier-home-runtime.tsx`.

## Run locally

From the repository root:

```sh
python3 -m http.server 4322 --bind 127.0.0.1 --directory previews/supplier-direction
```

Open `http://127.0.0.1:4322/` for English or `http://127.0.0.1:4322/ar.html` for Arabic. Product, company and support links intentionally point to the main website at `http://localhost:4318`; run it with `npm run dev -- --hostname localhost --port 4318` when reviewing those links. Enquiries prepare an email draft for the visitor to review and send.

## Edit

- Edit structure in `index.html` and Arabic copy in `locales/ar.json`.
- Run `python3 previews/supplier-direction/build-locales.py` to regenerate `ar.html`.
- Shared CSS and JavaScript serve both languages. English stays the default.
- `contact-actions.css` controls the vertical icon buttons and their staggered animation. System and site reduced-motion preferences disable it.
- Generated-image prompts and original PNGs are preserved beside the optimized WebP assets. Generated pictures are illustrative; source product names and technical specifications remain unchanged.

Prior intermediate mockups and unused imagery are excluded from this snapshot.

## Corporate refinement — 27 October 2026

The homepage uses a split product campaign hero, compact division navigation, a Tekbatt layout with an introduction beside the ranges, and a company section before services. Composition references: JFL Retail, Al Seer and Truebell. No third-party branding, imagery or business claims were copied. Existing SFGT product photography and clearly described campaign illustrations remain in use.

Edit `corporate-refinement.css` here, then run the locale builder and sync script above. The main hero uses `campaign.webp` (150 KB) encoded from the existing campaign image. The form continues to open an email draft; this design change does not configure email delivery.
