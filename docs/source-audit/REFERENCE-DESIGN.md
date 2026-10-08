# Reference-matched SFGT design

The latest user instruction is to match the supplied website image and generate matching campaign imagery. This supersedes the previous industrial-atlas layout and earlier restriction on generated marketing art.

## Implemented

- Compact white header and a two-column hero with red headline emphasis, two enquiry/discovery actions, three small support points, and a generated Toshiba/Dubai product stage.
- Horizontal product-range navigation; compact company introduction and verified 2013/Dubai/customer relationship facts.
- Three featured product cards, using original catalogue imagery for the battery pack and LED bulb and a generated tabletop composition for the existing Heavy Duty AA range.
- Accessible native service accordions beside a generated campaign image; four compact homepage FAQs, retaining all eight FAQs and JSON-LD on the support page.
- Red skyline enquiry banner and a compact four-column charcoal footer.
- English and German preserved. Light remains the default. Actual company contacts and product labels replace the placeholder/inconsistent details visible in the mockup.

## Generated images

All four assets were generated with the built-in imagegen tool and saved within the project. Product detail pages retain their original source photographs and specifications. The marketing compositions use the real product references; they do not add certification, warranty, or manufacturer-authorization claims.

| Image                             | Saved asset                                                                             | Dimensions  | Generation prompt                           |
| --------------------------------- | --------------------------------------------------------------------------------------- | ----------- | ------------------------------------------- |
| Dubai product-stage hero          | [`hero-dubai-v1.png`](../../public/images/campaign/hero-dubai-v1.png)                   | 1448 × 1086 | [Exact prompt](HERO-IMAGE-PROMPT.md)        |
| Heavy Duty battery tabletop scene | [`batteries-lifestyle-v1.png`](../../public/images/campaign/batteries-lifestyle-v1.png) | 1536 × 1024 | [Exact prompt](BATTERY-LIFESTYLE-PROMPT.md) |
| Hand placing a High Power battery | [`service-lifestyle-v1.png`](../../public/images/campaign/service-lifestyle-v1.png)     | 1925 × 817  | [Exact prompt](SERVICE-IMAGE-PROMPT.md)     |
| Red Dubai skyline banner          | [`dubai-contact-v1.png`](../../public/images/campaign/dubai-contact-v1.png)             | 2172 × 724  | [Exact prompt](CONTACT-IMAGE-PROMPT.md)     |

The original generated files remain under Codex's generated-images directory. Project references point only to the copies above. Next.js Image supplies responsive optimization, priority loading for the hero, and lazy loading below the fold.

## Main changed files

`src/app/[locale]/(website)/page.tsx`, `src/app/[locale]/globals.css`, hero/company/product/service/FAQ/contact/footer components and their CSS in `src/features/landing/`, and the matching English/German message files.

## Visual checks

Inspected the implemented site in the browser at 1440, 1024, 768, 390 and 375 pixels, including German text. Corrected narrow-screen button alignment, tablet fact layout, and muted-text contrast. Confirmed service disclosure keyboard operation and image framing.

Final production screenshots: [desktop](screenshots/reference-home-desktop.jpg), [full page](screenshots/reference-home-full.jpg), and [mobile](screenshots/reference-home-mobile.jpg). All homepage images loaded, with no horizontal overflow at the checked widths. The featured product link opens the correct product and carries its name and code into the enquiry form. Mobile navigation opens and closes correctly. Production browser console reports no warnings or errors during these checks.

## Validation

- `npm run build`: passed.
- `npm run typecheck`: passed.
- `npm run lint`: no errors; eight existing warnings in unchanged auth, user and shared code.
- `npm run check:catalogue`: passed; 206 products, 149 source specifications, 63 categories, 579 source mappings, original image provenance, four original PDF downloads, and translation parity retained.
- `python3 scripts/check-public-site.py http://localhost:4318`: 550 public pages and SEO verified, including hidden routes, 404s, catalogue states, legacy redirects, sitemap, robots, and four PDF downloads.
- `git diff --check`: passed.

## Remaining public pages — completed redesign

The homepage design now extends through every public page family. The hidden dashboard and authentication routes remain dormant.

| Page family                     | Design and UX changes                                                                                                                                                  | Visual evidence                                                                                                                                               |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| About                           | Compact introduction, verified company facts, product imagery, and clearly separated company principles                                                                | [Full desktop page](screenshots/inner-about-desktop.jpg)                                                                                                      |
| Services                        | Campaign introduction, numbered capabilities, distribution enquiry panel, and direct access to documents                                                               | [Full desktop page](screenshots/inner-services-desktop.jpg)                                                                                                   |
| Support                         | Three resource shortcuts, organised PDF library, eight accessible FAQ disclosures                                                                                      | [Full desktop page](screenshots/inner-support-desktop.jpg)                                                                                                    |
| Contact                         | Clear contact details, structured enquiry form, accessible errors, and immediate email/call actions on mobile                                                          | [Desktop](screenshots/inner-contact-desktop.jpg), [mobile](screenshots/inner-contact-mobile.jpg)                                                              |
| Catalogue and all 63 categories | Consistent division navigation, collapsible range navigation, search/refine controls, removable filter chips, numbered pagination, and helpful empty/range-only states | [Desktop](screenshots/inner-catalogue-desktop.jpg), [mobile](screenshots/inner-catalogue-mobile.jpg)                                                          |
| All 206 products                | Clear identity and codes, responsive photo gallery, previous/next controls, enquiry actions, section navigation, readable source tables and related products           | [Desktop](screenshots/inner-product-desktop.jpg), [mobile](screenshots/inner-product-mobile.jpg), [mobile table](screenshots/inner-specifications-mobile.jpg) |
| Missing pages                   | Branded 404 content within the public header/footer, with catalogue and home recovery links                                                                            | [Desktop](screenshots/inner-404-desktop.jpg)                                                                                                                  |

Shared page headings now use the homepage's restrained scale and spacing. Unused styles from the previous page designs were removed. Existing company facts, source text, product photos, specifications, downloads and metadata were retained. The existing generated campaign assets are reused on About and Services; no additional images were generated for this extension.

### Verification of the extension

- Visually inspected each page family at desktop and mobile sizes, including battery, LED and commodity details, category browsing, an enquiry-only lighting range, empty search, and 404 recovery.
- Checked the six primary page families in German at 375px, with no horizontal page overflow; reviewed German Contact and Services at 768px. English mobile checks use 390px and desktop checks use 1440px.
- Browser search returned the expected LPT-6000 result; removing its chip restored the catalogue. Applying Sugar returned four products and correctly highlighted Commodities. Numbered pagination opened page 2 and scrolled to the results heading below the sticky navigation.
- Gallery next-image selection updated the image and live position label. Enquiry links retained their product selection. Empty form submission displayed three associated errors and focused the name field.
- LED specifications stayed within a 348px scroll region on a 390px page while retaining all 940px of table content. The keyboard scrolled the table horizontally. Product headings appear before gallery content on mobile.
- FAQ disclosures opened with Enter. Contact's mobile email and call links use the existing verified company addresses and numbers.
- Production browser review showed no application console warnings or errors on the company, service, support and contact pages.
- Production build, standalone TypeScript check, catalogue integrity check and all 550 public-route/SEO checks passed. Lint reports no errors and eight existing warnings in unchanged dashboard/auth/shared code. The route check includes hidden routes, 404 status, search/filter/page states, legacy redirects, sitemap, robots and all four PDF downloads.

The contact form continues to prepare a draft in the visitor's email application; it does not send a message from the website. No database changes or deployment were required.

## Batteries page — focused usability refinement

The `/products/batteries` overview now has a dedicated, compact shopping layout. A small Toshiba introduction and the existing campaign photo lead directly to a desktop range sidebar, product-name/code search and visible sorting. The six ranges stay available while browsing; on mobile they move into a collapsible menu. Cards show original photos, names and codes in a three-column desktop grid, two-column mobile grid and single-column layout on very narrow screens.

The page retains all 82 products, using 12 per page. Category, search and sort selections are shareable in the URL and removable individually. Pagination returns to the result heading below the fixed navigation. Unrelated category query values are ignored, while deep battery category links remain supported. Sorting retains keyboard focus and the result count is a polite live status. Empty searches offer a clear route back to all products. Battery guidance and a prefilled range enquiry are accessible directly from the page.

Checked desktop (1440px), tablet (768px), mobile (390px) and long German category labels (375px). Browser checks covered range selection, code search, empty results, filter reset, keyboard sorting/focus and pagination. Production build, TypeScript, catalogue integrity and 12 focused production route/filter checks passed. ESLint reports zero errors with the same eight existing warnings outside this change. Other catalogue templates retain their existing layouts.

Final production evidence: [desktop](screenshots/batteries-redesign-desktop.jpg) and [mobile](screenshots/batteries-redesign-mobile.jpg).

## Remaining pages — batteries design extension

The latest refinement carries the approved batteries page's compact, white-and-red design through the rest of the public website.

| Page family              | Latest refinement                                                                                                                                                                    | Production screenshot                                                                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Catalogue and categories | Compact introductions, persistent desktop range navigation, nested categories, mobile range menus, URL-based search/family/sort controls, removable filters and 12 products per page | [Catalogue](screenshots/refined-catalogue-desktop.jpg), [lighting](screenshots/refined-lighting-desktop.jpg), [commodities](screenshots/refined-commodities-desktop.jpg) |
| Product details          | Tighter photo and summary layout, prominent enquiry action, section navigation, keyboard-accessible gallery and readable source specification tables                                 | [Product](screenshots/refined-product-desktop.jpg)                                                                                                                       |
| About                    | Split introduction, three concise company facts, clearer company story and principles                                                                                                | [About](screenshots/refined-about-desktop.jpg)                                                                                                                           |
| Services                 | Numbered capability panels with specific actions, distribution enquiry and document access                                                                                           | [Services](screenshots/refined-services-desktop.jpg)                                                                                                                     |
| Support                  | Task navigation, compact PDF rows, one readable FAQ column and contained keyboard focus outlines                                                                                     | [Support](screenshots/refined-support-desktop.jpg)                                                                                                                       |
| Contact                  | Immediate email, phone and WhatsApp actions, a clear enquiry form and grouped office details                                                                                         | [Contact](screenshots/refined-contact-desktop.jpg)                                                                                                                       |
| Missing pages            | A labelled catalogue search alongside existing home and catalogue recovery links                                                                                                     | —                                                                                                                                                                        |

The homepage and approved batteries overview retain their design. All 206 products, 63 categories, original source photographs, specifications, four PDF downloads, company facts and English/German metadata remain intact. Existing campaign assets are reused. Contact enquiries still prepare an email draft; the website does not send messages directly.

### Verification of this refinement

- Reviewed all page families on desktop and mobile, including nested LED ranges, an enquiry-only range, commodity pages, missing pages and German layouts. Checked intermediate 640px layouts and the approved batteries overview for regressions.
- Confirmed nested category and family filtering, gallery keyboard navigation, product enquiry prefill, associated form errors and horizontally scrollable specification tables without page overflow.
- Production build, standalone TypeScript check, catalogue integrity check and all 550 public-page/SEO checks passed. The full route check includes search/filter/pagination, hidden routes, 404 responses, redirects, sitemap, robots and all four PDFs.
- ESLint reports zero errors and the same eight existing warnings in unchanged auth, user and shared boilerplate. `git diff --check` passed.

## Catalogue dropdown refinement

Product family and sorting controls now use styled menus that follow the public site's theme, typography and red selection accents. The family menu has an alphabetized, searchable list, a bounded scroll area, a localized empty state and selected-item checkmarks. Sorting retains its two clear choices. Both controls support keyboard navigation and focus restoration; narrow screens use larger touch targets and stacked fields where needed.

Verified family search and selection, empty search, Escape and rapid reopen, sorting, clearing a family while preserving sort, preservation of category and search, pagination reset, and Back restoring the previous values. English 390px and German 320px layouts have no horizontal overflow, including the battery-only sort control. Build, TypeScript, catalogue integrity and translation parity checks passed; lint has no errors and the same eight existing warnings.

Production evidence: [family menu](screenshots/catalogue-dropdowns-desktop.jpg) and [sort menu](screenshots/catalogue-sort-desktop.jpg).

## Cleaner catalogue introduction

Removed the three-image collage from the all-products overview. A compact introduction now places the title beside the description and enquiry link on desktop, then stacks them on mobile. Search, filters and products move higher on the page. Individual category images and the dedicated batteries page retain their layouts.

Verified the production page at 1280px and 312px with no horizontal overflow, and confirmed LED category imagery remains present. Production build, TypeScript compilation, focused lint and whitespace checks passed. Evidence: [desktop](screenshots/catalogue-clean-header-desktop.jpg) and [mobile](screenshots/catalogue-clean-header-mobile.jpg).

## Alkaline batteries introduction

The alkaline category now uses the compact introduction, replacing its large, repeated High Power pack image with practical English/German guidance for browsing High Power and Alpha Power. Product photographs remain in the grid, with all 33 items intact (27 High Power and six Alpha Power). The presentation override is limited to this category; other category headers retain their existing images.

Production build and TypeScript compilation, focused lint, catalogue integrity, translation parity and whitespace checks passed. Browser checks confirmed all first-page photos loaded, Alpha Power filtering returns six products, and English 390px/German 320px layouts have no horizontal overflow. Evidence: [desktop](screenshots/alkaline-compact-desktop.jpg) and [mobile](screenshots/alkaline-compact-mobile.jpg).
