# Premium homepage — 30 October 2026

Implemented from the supplied full-page reference image and JSON. The homepage is now built from React server components, preserving the catalogue routes, bilingual metadata, organization structured data and existing enquiry submission service.

## Design and content decisions

- Restored the previous warm, panoramic hero and its original three-line “Batteries, Lighting and Commodities for a Brighter Tomorrow” headline after the user preferred its visual impact to the plain split layout.
- Mobile category navigation retains the compact snap-scrolling rail with visible arrow controls and an always-available catalogue link. Desktop keeps four structured category tiles.
- The handwritten hero note returns as part of the original visual treatment. The seven red section labels/lines, three generic hero trust badges and continuous decorative motion remain removed.
- Section entrances restored on request: headings, product/category cards, brand showcase, company facts, services and quotation blocks fade upward once as they enter the viewport, with a short stagger across rows. Already-visible content stays stable; keyboard/pointer interaction and reduced-motion preferences immediately reveal content. Mobile uses a shorter, smaller entrance. The hero artwork and floating contact buttons stay stationary.
- The hero uses two registered 2172 × 724 photographs derived from the untouched master. OFF bakes localized diffuser shading into the photograph; ON adds material-aware reflected light to original pixels. An edited image supplied only a blurred exposure field, never generated geometry or lettering. The diffuser crossfades first (0–1050ms), then the full ON photograph follows (650–1800ms). Both fade out over 600ms. Existing click/tap, keyboard focus, reduced motion and 6.5%-opacity hover accent remain. Both assets decode before ignition; failures retain the OFF photograph. See [hero-lighting-assets.md](hero-lighting-assets.md) for provenance, rebuild instructions and pixel verification.
- The original SFGT brand logo remains unchanged.
- The four existing SVG sketches return on request: the Dubai skyline sits below the company facts, and requirements, quotation and coordination form a compact “How we work” row immediately before the quotation form. Mobile stacks the three steps vertically. English and Arabic copy explain each stage. Original line art is inlined from trusted repository assets and draws once when enough of it is visible (65% for the skyline, 35% for each process sketch). Existing visible art stays stable during hydration; no-JavaScript, reduced-motion and print views show the complete artwork.
- Manrope for English and IBM Plex Sans Arabic for Arabic, with the original handwritten accent restricted to the hero note.
- Panoramic hero, structured category navigation, four verified featured products, Toshiba showcase, commodities, Tekbatt, company facts, services, quotation form and a light footer. The restored hero retains its warm imagery while the improved navigation, carousel, accessible controls and form remain in place.
- Featured products use four desktop columns, two tablet columns and a single-card mobile carousel. Filters, previous/next controls, Home/End navigation, RTL scrolling and live position feedback are supported. Controls appear only after hydration; product links and native scrolling remain available without JavaScript.
- Keep Tekbatt, existing company name, established year, verified contact numbers and `tbts@sfgt-tbts.com`.
- Featured lamp is the catalogue's 4.7W E27 model; the reference's 9W model was not substituted into the data.
- Use actual available category routes, including Seeds & Grains, rather than inventing product ranges.
- No genuine staff or warehouse photographs were available. Company credibility is presented through verified history, operating markets and an office-map link. No fabricated staff/facility imagery; Dubai skyline is presented only as decorative line art.
- Form keeps its existing required fields, validation, spam protection, duplicate handling and delivery backend. Added an optional phone field. File uploads are not exposed because the current endpoint accepts JSON enquiries only.
- No placeholder social, privacy or terms links added. Existing support links remain functional.

## Generated artwork and prompt set

Created with the built-in image generation tool (not the fallback CLI). The following are the generation briefs, summarized for future art direction. Existing Toshiba campaign artwork was used as the product/style reference for the first two images. These are conceptual marketing visuals, not documentary photographs of company facilities or assets.

### Hero

**Saved:** `public/images/premium-home/hero-dubai.webp` (2172 × 724; approximately 110 KB).

**Prompt brief:** Photorealistic commercial website hero in a very wide 3:1 composition. Keep the left 48% open and warm ivory for live text. Place a black-and-blue Toshiba High Power AA battery and white LED bulb on a stone podium at the right, with a Dubai skyline, Burj Khalifa, red architectural wall and a small plant. Warm natural morning light, realistic product materials and readable brand lettering. No added headings, slogans, UI, watermark or people.

### Toshiba showcase

**Saved:** `public/images/premium-home/toshiba-showcase.webp` (2172 × 724; approximately 84 KB).

**Prompt brief:** Wide 3:1 warm interior product photograph, based on the same Toshiba battery and bulb reference. Slightly tilted battery and softly glowing LED bulb on a travertine podium, grouped around the center/right. Leave the left third pale and uncluttered for live copy, and the right quarter light for category cards. Natural window light, restrained greenery, credible materials. No added text, UI or people.

### Trade logistics

**Saved:** `public/images/premium-home/trade-logistics.webp` (2172 × 724; approximately 86 KB).

**Prompt brief:** Wide 3:1 editorial commercial port photograph. Container vessel along the bottom middle/right, muted containers and port cranes on the horizon. Leave the upper two thirds and left third as clean, hazy warm sky for interface content. Ivory and late-afternoon tones. No lettering, logos or people. Generic trading imagery, with no claim of company fleet ownership.

All three originals remain in the Codex generated-images directory. WebP compression was performed for website delivery without altering the artwork. The hero and Toshiba scene now use their optimized source WebPs directly so cropping a panorama does not upscale a small Next Image thumbnail. The logistics artwork is retained as an unused asset; the quotation form now has a plain background.

### Catalogue thumbnails

The three `*-thumb.webp` images in `public/images/premium-home/` are optimized derivatives of existing catalogue product photographs, not generated products:

- `alkaline-thumb.webp` ← `c984f26e50-01102020044050LR6GCP-BP-4CN.jpg`
- `rechargeable-thumb.webp` ← `afa17e3e77-01102020074424TNH-6GAE-BP-2C.jpg`
- `lighting-thumb.webp` ← `8b5032f0f2-07112024063132abulbprod1.png`

## Verification

- Production build and TypeScript pass.
- ESLint: no errors; eight existing warnings elsewhere in the repository.
- All 16 enquiry checks pass without sending emails.
- Catalogue validation: 206 products, 63 categories and translation parity pass.
- Browser checked in English and Arabic at 320, 375, 390, 430, 768, 1024 and 1440px; no horizontal page overflow or visible buttons below 44px.
- Product filtering, carousel controls and keyboard endpoints, category scrolling, mobile navigation, centered search, language switching, product-to-quote prefilling and empty-form validation checked without sending email.
- Reduced-motion styles and no-JavaScript visibility preserved.
