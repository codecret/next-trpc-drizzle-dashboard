# SFGT website: current handover status

Status updated 27 October 2026. The company domain is connected; see the [domain connection record](../delivery/DOMAIN-CUTOVER-2026-10-27.md). Email delivery, mailbox backup, analytics and operational handover are separate from the website release. Private client correspondence and machine-specific backup records are kept outside source control.

## Current website and deployment

The selected supplier homepage is integrated into the main Next.js application in English and Arabic, at `/` and `/ar`. It presents Toshiba, Tekbatt and commodities, with generated illustrative visuals, product selection, enquiry draft preparation and animated contact controls. About, Products, Services, Support and Contact remain part of the same company website. Public pages use a light theme.

The production domain is [sfgt-tbts.com](https://sfgt-tbts.com), with [sfgt-website.vercel.app](https://sfgt-website.vercel.app) retained as a Vercel alias. The domain connection was verified on 27 October 2026. The subsequent homepage refinement has been verified locally; confirm the deployed commit before reporting it as published. Website availability does not establish working mailbox access or enquiry inbox delivery.

The supplier HTML sources are `previews/supplier-direction/index.html` and `ar.html`. `scripts/sync-supplier-home.py` prepares `src/features/landing/supplier-home-markup.json` and assets under `public/images/supplier-home/`. The main route is `src/app/[locale]/(supplier)/page.tsx`; its scoped styles and client behavior live in `src/features/landing/supplier-home*`. The preview directory remains source material, but the selected design is no longer preview-only.

## Source state and reproducibility

This release preserves commit `134ccb7` in history and records the subsequent supplier-home restoration and corporate refinement in a new commit. The main homepage source, generated English/Arabic markup, scoped styles and referenced assets are included in the repository. A checkout of the earlier industrial-design commit alone does not reproduce this design.

Run the locale builder and supplier sync script after editing the preview sources. A source checkout is not a backup of company mailboxes. Operational credentials and machine-specific backup manifests must remain outside Git.

## Available implementation

- One company website in English and Arabic. Retired `/de` bookmarks redirect to the corresponding English page and retain the query string.
- 206 product pages: 82 battery/torch products, 65 lighting products with their published variants, and 59 commodities.
- 63 category pages preserving the source hierarchy, including ranges for which the source publishes no individual models.
- Product search by name, model/code and specification; category/family filters; sorting; pagination; galleries; source specification tables; related products; product-specific enquiry links.
- Four original procedure/payment-method PDFs. These are downloads, not certifications or technical specification sheets.
- Canonical and alternate-language URLs, page metadata, Open Graph, Organization/Product/ProductGroup/Breadcrumb structured data, sitemap and legacy path redirects.
- Public-phase 404 gates for `/admin`, `/dashboard`, `/auth`, `/api/auth` and `/api/trpc`, including nested routes. These return `X-Robots-Tag: noindex, nofollow`. Existing dashboard, authentication and database source remains intact; `/api/enquiry` remains available.

## Enquiry behavior and email boundaries

The supplier homepage always prepares an email draft on the visitor's device and offers a copy fallback. Its implementation in `supplier-home-interactions.ts` uses `tbts@sfgt-tbts.com` directly. It does not call the server enquiry endpoint.

The separate Contact page renders `EnquiryForm`, which can submit through `POST /api/enquiry` when both `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` are configured. Otherwise it also offers an email draft. Its server recipient comes from `company.email` in `src/features/catalogue/catalogue.ts`. On 19 October 2026, a production environment-variable name inventory confirmed neither delivery variable was configured. Configuring delivery for Contact does not change the homepage behavior. See [enquiry delivery](../enquiry-delivery.md) for the actual setup and verification requirements.

No verified production inbox-delivery result, mailbox backup or mail migration is recorded here. Website hosting and transactional enquiry sending are separate from the company's existing shared-server mail service. Confirm recipients, mailbox inventory, provider access and backup requirements with the company and existing provider before making mail-related changes.

## Verification record

On 27 October 2026, the corporate refinement passed a production build and TypeScript checks. ESLint completed with no errors and eight existing boilerplate warnings. Desktop and mobile browser checks covered the English/Arabic layouts, product filters, mobile navigation, quotation prefill, reduced motion and keyboard focus clearance. The hero campaign image was encoded to WebP at approximately 150 KB. No enquiry email was sent during these checks.

Earlier source-audit work recorded build, lint, typecheck, catalogue checks, HTTP checks and responsive browser checks. Those records and screenshots describe their respective development iterations; they are not a new acceptance report for today's working tree. In particular, the original handover's English/German references and no-deployment status are historical and superseded by this document.

The focused HTTP smoke check recorded for the Vercel deployment verified:

- HTTP 200, one H1 and production canonical/Open Graph URLs on `/`, `/ar`, `/products` and `/products/sugar-icumsa-45`.
- Arabic `lang="ar"` and `dir="rtl"` on `/ar`.
- HTTP 404 and `noindex, nofollow` for `/api/auth/get-session` and `/api/trpc/user.getCurrentUser`.
- A 550-URL sitemap using the Vercel production origin, 44 referenced homepage assets returning HTTP 200, and all four downloads returning valid PDF headers.

On 19 October 2026, a further read-only HTTP sample reconfirmed HTTP 200 on `/`, `/ar`, `/contact` and `/products`, a 550-URL sitemap and HTTP 404 on the dormant APIs. These checks sent no enquiry and do not establish inbox delivery, Search Console/Analytics setup, mailbox backup, company-domain cutover or final client acceptance. No fresh build, lint or typecheck was run for this documentation correction.

For future verification, use `npm run build`, `npm run lint`, `npm run typecheck`, `npm run check:catalogue` and `python3 scripts/check-public-site.py <origin>` as appropriate. The public-site script writes its report to `docs/source-audit/http-verification.json`. Mocked enquiry checks are documented separately. Record the tested source snapshot, origin and date rather than treating historical reports as current proof.

## Content provenance and unresolved source facts

`AUDIT.md` records the source investigation, exclusions and mapping decisions. `source-inventory.json` retains the 579 audited response records; `route-map.json` maps those URLs to the consolidated site. `asset-manifest.json` retains the original catalogue image provenance. Generated campaign/supplier visuals are illustrations and are not evidence of company facilities or certifications.

The catalogue data is `src/features/catalogue/data/catalogue.json`. Shared interface/company copy is in the `Website` namespace of `messages/en.json` and `messages/ar.json`; the supplier homepage has its separate EN/AR source markup. Source product names and technical specifications remain in English where retained from the catalogue.

Unresolved source facts are visibly flagged rather than corrected by assumption: reused battery codes; MP-40/MP-12 packaging mismatch; conflicting AAA MP-12 pallet quantities (both tables retained); a watt value in a lumen field; E27/E14 base mismatch; and the ambiguous “Corn GNO” name. Unsupported certifications, generic statistics and placeholder testimonials were excluded. Confirm these source issues and current business/partner claims with the company before changing the published facts.

Earlier design history remains in [design refinement notes](DESIGN-REFINEMENT.md), [reference design notes](REFERENCE-DESIGN.md), [premium refinement notes](PREMIUM-REFINEMENT.md) and [industrial editorial notes](INDUSTRIAL-EDITORIAL.md). These describe past iterations, not the selected homepage's current release state.

## Running and company-domain launch

Use `npm run dev` for development, or `npm run build` followed by `npm run start` for a local production build. The public catalogue does not query a database. Dormant boilerplate environment validation still applies; use `src/lib/env.ts` and `.env.example` for required configuration names without copying private values into documentation or archives.

Vercel's build command is `npm run build`. `.vercelignore` excludes `previews/` and `docs/`, so the generated homepage markup and public assets must be present before uploading. The manual homepage-sync and source-audit scripts depend on those excluded source directories and are not deployment build hooks.

Before company-domain launch, set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_BETTER_AUTH_URL` to the agreed canonical origin and rebuild. This updates metadata, structured data and sitemap origins. Confirm canonical-host redirects and recheck English/Arabic routes on the final domain. Legacy path redirects apply only when requests reach this Next.js application; handling old domains requires separate DNS/hosting coordination.

Search Console ownership/submission, Analytics configuration, mailbox backups, domain/mail changes, account ownership, renewal dates and support/handover terms remain items for the [domain connection record](../delivery/DOMAIN-CUTOVER-2026-10-27.md). No completion claim for those items is made by this document.
