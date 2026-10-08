# Consolidated SFGT website

Content consolidation completed 7 October 2026 in the existing Next.js project. The public design was refined on 8 October with Manrope typography, a warm neutral and brand-red palette, new page layouts and improved product navigation. See [design refinement notes](DESIGN-REFINEMENT.md). No new framework, dependencies, database schema or dashboard functionality was added.

The latest reference-matched design, generated campaign imagery, page refinements, searchable dropdowns and compact catalogue headers are documented in [reference design notes](REFERENCE-DESIGN.md), with final screenshots and verification results. Earlier iterations remain in [premium refinement notes](PREMIUM-REFINEMENT.md).

## Delivered

- One company site with Home, About, Products, Services, Support and Contact in English and German.
- 206 product pages: 82 battery/torch products, 65 lighting products with their published variants, and 59 commodities.
- 63 category pages preserving the source hierarchy, including ranges for which the source publishes no individual models.
- Product search by name, model/code and specification; category/family filters; sorting; pagination; galleries; complete source specification tables; related products; product-specific enquiry links.
- Four original procedure/payment-method PDFs. These are downloads, not certifications or technical specification sheets.
- Canonical and alternate-language URLs, page metadata, Open Graph, Organization/Product/ProductGroup/Breadcrumb structured data, sitemap and legacy redirects.
- Dashboard, admin and authentication pages return 404 and have no public navigation entry. Their existing source files, APIs, auth configuration and database code remain intact.

## Verification

The following passed against the final code and production preview:

```sh
npm run build
npm run lint
npm run typecheck
npm run check:catalogue
python3 scripts/check-public-site.py http://localhost:4318
git diff --check
```

Lint has zero errors and eight warnings in unchanged template auth/user/shared components. The production build needs network access for the template's existing Google Fonts imports.

The catalogue check compares all 149 primary Toshiba source records with the consolidated catalogue, including specification tables, source coverage, local image provenance, PDF checksums and translation-key parity. The HTTP check verifies all 550 localized public URLs and their metadata, canonical paths, JSON-LD and public links, plus hidden routes, unknown-page 404s, search/filter/pagination states, legacy redirects, the 550-entry sitemap, robots and PDFs. Its report is `http-verification.json`.

Browser checks covered desktop (1280px), laptop (1024px), tablet (768px) and mobile (390px): navigation and category links, English/German switching with route and query preservation, product gallery switching, product enquiry prefill and validation, and keyboard scrolling within wide specification tables. Inspected pages had no horizontal page overflow; the production browser session reported no console errors. Screenshots are in `screenshots/`.

No email was sent, database migration run or deployment made.

## Content ownership and known source issues

`AUDIT.md` records the source investigation, exclusions and mapping decisions. `source-inventory.json` retains the 579 audited response records; `route-map.json` maps those URLs to the new site. `asset-manifest.json` retains image provenance; only used source images are shipped in `public/images/catalogue/`.

The catalogue data is `src/features/catalogue/data/catalogue.json`. Interface/company copy is in the `Website` namespace of both translation files. Source product names and technical specifications remain in English on German pages, with an explanatory label.

Unresolved source facts are visibly flagged rather than corrected by assumption: reused battery codes; MP-40/MP-12 packaging mismatch; conflicting AAA MP-12 pallet quantities (both tables retained); a watt value in a lumen field; E27/E14 base mismatch; and the ambiguous “Corn GNO” name. Unsupported certifications, current-partner claims, generic statistics and placeholder testimonials were excluded. Confirm these source issues with the business before changing the published facts.

## Running and future deployment

The current local production preview uses `http://localhost:4318`. To restart that preview after building:

```sh
NODE_OPTIONS=--dns-result-order=ipv4first npm run start -- --hostname localhost --port 4318
```

Use `npm run dev` for normal development. The ignored `.env.local` contains local preview URLs, a generated local auth secret and a placeholder local PostgreSQL connection; no database service was provisioned or tested. The public catalogue does not query a database.

Before a future deployment, set `NEXT_PUBLIC_SITE_URL` to the chosen canonical domain and rebuild so the sitemap, metadata and structured data use that origin. Keep the existing auth environment configured as required by `src/lib/env.ts`; `.env.example` documents the settings. No production domain has been assumed.

The contact form deliberately opens an email draft on the visitor's device and offers a copy fallback. Its label and privacy text explain that it neither sends nor stores enquiries. Direct email, telephone and WhatsApp links use the source contact details. A server-side sending workflow would require a separate configured delivery service.

Legacy redirects operate when those old paths reach this Next.js app. Redirecting the old domains themselves requires a later DNS/hosting change. Dashboard reactivation likewise requires a deliberate later change to the gate in `src/proxy.ts`.
