# SFGT — Modern Industrial Editorial

The latest brief supersedes the earlier refinement-only direction. The public homepage now uses a new composition; existing catalogue routes, data, forms, metadata, bilingual routing, and hidden administration remain in place.

## Concept selection

Three approaches were compared before implementation:

| Direction | Originality and brand fit | Product presentation | Usability and feasibility |
| --- | --- | --- | --- |
| Industrial Product Atlas — selected | Strong scale contrasts, numbered editorial chapters, warm architectural paper and charcoal; fits a mature trading company | Real product photography presented at meaningful scale; asymmetric battery, lighting and commodity compositions | Clear conventional links within an unconventional layout; original assets work without retouching or new dependencies |
| Trading Journal | Red vertical spine and alternating magazine spreads create a recognizable editorial identity | Good contextual storytelling but less immediate product emphasis | Vertical navigation becomes cumbersome on smaller screens and long German labels |
| Product Monograph | Quiet gallery-like scenes with a centered product and cinematic pacing | Strong single-object focus | Would depend on higher-resolution transparent source photography and risk excessive empty space or superficial imitation of consumer electronics brands |

The previous page was dominated by repeating two-column sections, a framed hero collage, equal product cards, and accordion-dependent service discovery. The selected atlas composition replaces those patterns with a continuous journey: opening statement → product index → company → capabilities → support → enquiry.

## Implemented direction

- Oversized Manrope headline with tight optical spacing; Geist Mono for compact technical annotations.
- Warm white `#f5f4ef`, charcoal `#20211f`, industrial gray, original logo red `#ea252c`, and darker accessible red `#d52027` for small text and controls.
- One authentic Toshiba 9V image, unframed and blended into the hero field. No generated imagery, product retouching, invented specifications, or manufacturer authorization claims.
- A large battery-pack presentation, complementary LED composition, and compact commodity selection. Commodities remain within the approved consolidated scope.
- A charcoal company chapter using the verified Dubai location and 2013 founding date.
- Fully visible service chapters instead of a homepage service accordion.
- A compact support section retaining native, keyboard-operable disclosures. The full support page retains its eight questions and FAQ structured data.
- An oversized contact invitation with a functional circular enquiry arrow and direct phone link; structured dark footer with original logo and verified contact information.
- English and German copy added with matching keys. Light remains the default theme.
- No animation dependency added. Existing reduced-motion support covers all new elements.

## Main files

- `src/app/[locale]/(website)/page.tsx`
- `src/app/[locale]/globals.css`
- `src/features/landing/home-hero.tsx` and `.css`
- `src/features/landing/home-page.css`
- `src/features/landing/product-editorial.tsx` and `.css`
- `src/features/landing/service-feature.tsx`
- `src/features/landing/battery-faq.tsx`
- `src/features/landing/services-faq.css`
- `src/features/landing/contact-banner.tsx` and `.css`
- `src/features/landing/site-footer.tsx`
- `src/features/landing/industrial-footer.css`
- `src/features/landing/navigation-footer.css`
- `messages/en.json` and `messages/de.json`

## Source constraints

Original product photographs vary in resolution and appearance; their factual content is preserved. The enquiry flow creates an email draft using the existing implementation. No deployment, production data change, database migration, or outbound enquiry is part of this design update.

## Verification — 8 October 2026

- `npm run build`: passed, including Next.js production compilation and static generation.
- `npm run typecheck`: passed.
- `npm run lint`: zero errors; eight existing warnings in unchanged authentication, users-table and shared utility components.
- `npm run check:catalogue`: passed — 206 products, 149 source specification records, 63 categories, 579 source mappings, image provenance, four original PDFs and translation-key parity.
- `python3 scripts/check-public-site.py http://localhost:4318`: passed — 550 public pages with SEO, hidden routes/404s, filters/search/pagination, legacy redirects, sitemap, robots, and PDF downloads. Results saved in `http-verification.json`.
- Browser screenshot inspection at 1440, 1024, 768, 390 and 375px, including German layouts. No document-level horizontal overflow in the measured mobile/tablet layouts.
- Confirmed product-index anchor lands below the sticky header; native FAQ expands using Enter; mobile language menu and desktop product menu operate correctly; hero product opens the correct detail page; enquiry carries the correct product name/code into the form.
- Fresh production browser: no console warnings/errors after language switching, product navigation and enquiry navigation. Light theme confirmed from rendered page state.
- All five homepage product images loaded successfully. Original lower-resolution assets remain a source limitation; none were replaced with invented imagery.
- `git diff --check`: passed.

### Screenshots

- `screenshots/industrial-home-desktop.jpg` — production desktop opening, 1440px.
- `screenshots/industrial-home-full.jpg` — production full homepage after lazy images loaded.
- `screenshots/industrial-home-mobile.jpg` — production mobile opening, 390px.
