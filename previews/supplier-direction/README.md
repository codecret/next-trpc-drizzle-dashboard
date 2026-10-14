# SFGT supplier homepage preview

This is the latest reviewed homepage direction, saved alongside the Next.js website. It includes Toshiba products, Tekbatt, commodities, English/Arabic copy, scroll animation, generated imagery and animated floating WhatsApp/call icons for **+971 50 342 0157**.

The Next.js application in `src/` remains the main website. This static preview is not wired into its homepage route or deployed by the Next.js build.

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
