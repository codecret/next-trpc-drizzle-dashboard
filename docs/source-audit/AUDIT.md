# Source audit and implementation mapping

Audited 7 October 2026, before implementation. Sources: https://www.toshibabts.com/, https://www.sfgt-tbts.com/, and the latter's two destination sites https://toshiba.sfgt-tbts.com/ and https://commodities.sfgt-tbts.com/.

## Coverage

541 linked page URLs plus 4 ASP.NET pagination responses and 34 additional product URLs were inspected (579 responses). This includes both Toshiba mirrors, all navigation/category branches, product pages, company pages, contact, distributor, FAQ, support, media, footer links, product images, technical images, tables, and four PDF downloads. Six old aggregate battery category URLs return HTTP 500; their working subcategory pages supply the content. No catalogue link was inferred by enumerating product IDs.

All corresponding Toshiba mirror pages have identical extracted content. Publish one copy and retain both source URLs as provenance. Of 84 battery/torch source entries, two pairs are duplicate MP-12 listings. Consolidate AA IDs 62/63 and AAA IDs 120/123; the latter has conflicting pallet quantities, so retain both values and flag the conflict. Final catalogue: 82 battery/torch products, 65 LED products (including all tabulated variants), 59 commodities = 206 product pages.

## Existing project audit

The repository is a Next.js 16 App Router admin boilerplate with an existing public landing page. Preserve its monochrome tokens, Arial body typography, spacing scale, shadcn components, responsive sheet/navigation, feature accordion, buttons, FAQ layout, and footer pattern. The landing content is still demo software marketing, and every navigation destination is a placeholder. Reuse/adapt the landing components and shared UI; add a catalogue feature and public route group. No replacement framework or design system.

Keep the admin, dashboard, authentication, tRPC, and database source. Public navigation must have no login/admin/dashboard links. Disable dashboard/admin/auth page entry points for this phase; preserve their code. No database changes are needed. Existing locale architecture is English/German with an unprefixed English URL. Keep both translation files synchronized; source product names and technical specifications remain in their original English, explicitly identified on German pages.

## Page mapping (decided before implementation)

| Source content | Consolidated destination | Decision |
| --- | --- | --- |
| Toshiba Default.aspx; SFGT portal; commodities index.html | `/` | One SFGT company homepage presenting batteries, lighting and commodities |
| Both About pages | `/about` | Company established in 2013, Dubai base, distribution, sourcing, values and market coverage |
| Toshiba battery navigation and Products.aspx, all pages | `/products/batteries`, group/range pages, product pages | Preserve six battery groups, 16 subranges, product imagery, descriptions, packaging, technical images, benefits and uses |
| LED category/family/list/detail pages | `/products/led-lighting`, group/range pages, product pages | Preserve nine groups, 21 subranges, family names and all 65 product tables; empty published ranges remain enquiry-led |
| Eight commodities product groups | `/products/commodities`, category pages, product pages | Preserve all 59 names and images; no invented grades, origins, packaging or specifications |
| Commodities services.html + Toshiba What we do/Mission | `/services` | Trading, sourcing, distribution, warehousing, logistics, supplier/customer support |
| Toshiba Distributors.aspx | `/services#distribution` | Distributor enquiries; do not repeat conflicting years, exclusivity or country totals |
| Toshiba FAQ + commodities support.html | `/support` | Battery guidance and four original PDF downloads |
| Toshiba and commodities contact pages/footer | `/contact` | One office with verified telephone/email options and opening hours |
| Commodities media.html | About-page image gallery if attributable; otherwise retained only in audit | Images have no captions or company attribution; do not invent event/team claims |
| Source URLs | `route-map.json` and legacy redirects | Map useful old pages to current destinations; retain source-domain provenance |

Primary navigation: Home, Products, About us, Services, Support, Contact. Main product groups use `/products/[category]`, individual products use `/products/[product-slug]` through one slug resolver. Breadcrumbs preserve hierarchy. Catalogue search covers names, source model codes, categories and variant specifications. Category filtering and pagination remain URL-addressable. Category families remain filterable without redundant pages for every old intermediate URL.

## Content decisions and unresolved issues

- Use the full legal company name **Sulemane Faruk General Trading LLC** and the SFGT shorthand. Toshiba is a product brand, not a second company identity.
- Office: Office and Warehouse No. 7, Al-Qusais Industrial Area 1, near Ministry of Labour, Dubai, UAE. P.O. Box 122577. Source: Toshiba Contactus.aspx. The commodities address is less detailed, not contradictory.
- Telephone +971 4 336 4633; mobile +971 56 500 6024; additional Toshiba/WhatsApp +971 50 342 0157. General email tbts@sfgt-tbts.com; Toshiba emails toshibabts.gcc@toshibabts.com and toshibabts.gcc@gmail.com. Preserve each with appropriate labels.
- Office hours: Monday–Saturday 09:00–18:00; Sunday closed (commodities footer).
- About says established in 2013; distributor page says 33 years, service page says 15 years, and generic home statistics say 30 years. Use the explicit founding date and omit inconsistent elapsed-time claims.
- Historical mentions of Landmark Group/Carrefour and geographical expansion are not proof of current partnerships. Keep in the audit evidence; do not show current partner logos or imply current contractual status.
- Footer images label “Agent”, “Member of”, “German Technologies” and “Our affiliates”, without adequate identifying text. No certification claim is substantiated. Do not invent certification badges or partnerships.
- Remove clearly unfinished authoring instructions on About, lorem-ipsum testimonial, generic consulting metrics/awards/partner counts, discount banners, sample product.html links, and placeholder newsletter functionality.
- “Random Products” contains cocoa powder/beans, vanilla beans, coffee beans and powdered milk; rename category **Other food products**, keep the source name in provenance. Ignore the unrelated generic masala description.
- “Meat & Fish” has 8 chicken and 22 beef cuts, no fish models. Keep the group name, do not invent fish products.
- “Corn GNO” is ambiguous. Retain exactly and flag for clarification.
- High Power AA and AAA entries reuse model/SFGT codes; do not merge different battery sizes merely because the codes repeat. Flag affected products for confirmation.
- High Power AA MP-40 (ID 116) is described with MP-12 code/12 cells in its table. Preserve and flag.
- AAA MP-12 IDs 120 and 123 have pallet values 2,880 and 2,820. Consolidate product while retaining both source tables and explain the discrepancy.
- LED ID 37 lists `4.5W` under LUMEN. Preserve the source value and flag, never change it to an assumed lumen value.
- LED ID 54 title/description says E27 while base field says E14. Preserve and flag.
- Blank specification cells mean not supplied, not zero. Display an em dash with a legend. Preserve all units and source table headers.
- Several lighting families publish zero products (floodlights, high bay, downlights, proof lights, panels, ceiling lights). Preserve range names, no invented models, stock or specifications.
- Commodity PDFs are procedures/payment-method documents, not certifications or product specification sheets. Preserve the original PDFs byte-for-byte and label them accurately. No form will request passports or banking data.
- Contact uses a validated enquiry composer that opens a draft in the visitor's email app, with an explicit label; no false “sent” state or unconfigured mail endpoint.
- Canonical origin is a validated deployment environment setting; no new final domain is assumed. Deployment is outside this implementation request.

## Acceptance checks

Run lint, typecheck and a production build. Verify catalogue integrity against source IDs, all tables/images/downloads, unique slugs, category membership, source URL coverage and translation-key parity. Exercise search, filters, pagination, product galleries, enquiry validation, navigation, locale switching and direct hidden-route access. Inspect desktop, laptop/tablet and mobile layouts, especially wide specifications. Verify sitemap, robots, metadata, canonical/hreflang and structured data without fabricated prices, ratings, stock or certifications.
