# Premium homepage — 30 October 2026

Implemented from the supplied full-page reference image and JSON. The homepage is now built from React server components, preserving the catalogue routes, bilingual metadata, organization structured data and existing enquiry submission service.

## Design and content decisions

- Mobile category navigation now uses a visible two-column grid through 900px, with a full-width product-catalogue link below.
- Follow-up refinement: removed all seven red section labels/lines and the three generic hero trust badges.

- Manrope for English; IBM Plex Sans Arabic for Arabic; locally hosted Caveat for the decorative English hero note.
- Full-width warm hero, overlapping category navigation, four verified featured products, Toshiba banner, commodities, Tekbatt, company facts, services, quotation form and a light footer.
- Keep Tekbatt, existing company name, established year, verified contact numbers and `tbts@sfgt-tbts.com`.
- Featured lamp is the catalogue's 4.7W E27 model; the reference's 9W model was not substituted into the data.
- Use actual available category routes, including Seeds & Grains, rather than inventing product ranges.
- No genuine staff or warehouse photographs were available. A Dubai location illustration is used instead of fabricated staff/facility imagery.
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

All three originals remain in the Codex generated-images directory. WebP compression was performed for website delivery without altering the artwork.

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
- Browser checked at desktop 1440px, tablet 820px and mobile 390px/320px, including Arabic RTL.
- Product filter, mobile Industries menu, centered search, product-to-quote prefilling and empty-form validation checked.
- Reduced-motion styles and no-JavaScript visibility preserved.
