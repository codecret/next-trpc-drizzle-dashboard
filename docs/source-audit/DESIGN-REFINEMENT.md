# Public design refinement

Completed 8 October 2026 in the existing Next.js site.

## Design and interaction changes

- Introduced public-only Manrope typography, warm neutral surfaces, charcoal text, brand-red accents, fine borders and consistent button sizing. Existing dashboard styling remains separate.
- Rebuilt the homepage hero around original Toshiba product photography, with an asymmetric desktop composition and a stacked mobile layout. Added direct links to all three divisions with verified catalogue counts.
- Refined the sticky header, expanded product menu and mobile navigation. Added a keyboard-accessible product search dialog and kept language switching available.
- Simplified the catalogue with visible search, expandable filters, selected-filter controls, clearer results and consistent product cards.
- Improved product pages with a sticky desktop gallery, section links, clearer enquiry actions and horizontally scrollable specification tables.
- Updated About, Services, Support and Contact, including readable download cards, FAQ disclosures and an enquiry form that appears first on mobile.
- Added a consistent enquiry section and footer. Retained light/dark themes and reduced-motion support.

All 206 products, 63 categories, source specifications, original product images, four PDF downloads and documented source issues remain intact. English and German interface keys are synchronized. Contact enquiries still prepare an email draft; this pass does not add email delivery.

## Verification

- Production build and TypeScript checks pass.
- Lint passes with no errors; eight existing warnings remain in unchanged template components.
- Catalogue integrity checks pass, including source coverage, specification tables, image provenance, PDF checksums and translation-key parity.
- HTTP verification passes for all 550 localized public URLs, metadata, links and structured data, plus hidden routes, 404s, search/filter/pagination, redirects, sitemap, robots and PDFs.
- Browser review covered 1440px desktop, 1024px laptop, 768px tablet and 390px mobile, plus German at 360px. Reviewed layouts have no horizontal page overflow.
- Verified search-dialog focus and Escape, product search, category filters, mobile navigation, enquiry validation and keyboard scrolling in wide specification tables.

Screenshots: [desktop homepage](screenshots/redesign-home-desktop.jpg), [complete homepage](screenshots/redesign-home-full.jpg), [mobile homepage](screenshots/redesign-home-mobile.jpg), [catalogue](screenshots/redesign-catalogue.jpg).

The local production preview is available at `http://localhost:4318/`. No deployment or commit was made.
