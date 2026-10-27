# Website enquiries

The integrated supplier homepage and the separate Contact page have different enquiry implementations in both English and Arabic. The review deployment is [sfgt-website.vercel.app](https://sfgt-website.vercel.app); its availability does not establish company-domain launch or tested inbox delivery. On 19 October 2026, the production environment-variable name inventory had neither `RESEND_API_KEY` nor `CONTACT_FROM_EMAIL`, so direct Contact page delivery was not configured. The later website-domain connection is recorded in the [cutover record](delivery/DOMAIN-CUTOVER-2026-10-27.md); mailbox access and inbox delivery remain separate work.

## Homepage: email draft

`src/features/landing/supplier-home-interactions.ts` handles the supplier homepage form. It validates the fields, prepares a `mailto:` link and exposes a copy fallback. The visitor must review and send the message in their email application. It does not call `/api/enquiry`, send email from the server or store an enquiry.

The homepage recipient is currently set directly to `tbts@sfgt-tbts.com` in that file. Configuring the server delivery variables below does **not** activate direct sending on the homepage. That requires a separate implementation change and verification. Keep the form's labels, status and privacy copy consistent with its actual behavior.

## Contact page: optional direct delivery

`src/app/[locale]/(website)/contact/page.tsx` renders `EnquiryForm` and passes `getEnquiryDeliveryEnabled()`. Name, email and requirements are required; company, product, quantity and destination are optional. Product-page enquiry links prefill the product field and open the optional details.

## Enable direct delivery

Set these server-side variables in the deployment environment (or `.env.local` for local use):

- `RESEND_API_KEY`: a Resend key permitted to send email.
- `CONTACT_FROM_EMAIL`: a sender email address on a domain verified in that Resend account.

Restart the application after configuring these variables; rebuild/redeploy if your host supplies environment variables during the build. Do not put credentials in public environment variables or commit them.

Server-submitted Contact page enquiries go to `company.email` in `src/features/catalogue/catalogue.ts`, currently `tbts@sfgt-tbts.com`. The visitor's address is the reply-to address. No recipient is accepted from the browser. Confirm the intended recipient with the company; changing `company.email` alone does not update the homepage's separate recipient. The provider must return an accepted message ID before the website shows a sent confirmation; this does not prove inbox delivery.

Without both variables, the Contact form offers an email draft and copy fallback. It never simulates a successful send. Provider or network failures preserve entered details and offer an explicit email fallback.

Website sending configuration is separate from existing mailbox hosting, backups and any future mailbox migration. Do not replace existing mail-related DNS records as a side effect of sender verification. Coordinate any required record additions with the current mail provider and the domain connection record.

## Verification

Run `node --import tsx --test scripts/check-enquiry.ts` for mocked delivery, validation, request-size/origin, idempotency and throttling checks. These tests send no email and do not cover the homepage's separate draft implementation. After configuring the production sender, verify actual receipt and reply behavior with the company's intended inbox, and record the result. This document does not assert that production sending is configured or that inbox delivery has been tested.

The public endpoint is `POST /api/enquiry`. It validates bounded JSON, checks origin, uses a honeypot and applies a bounded per-process throttle. Deployment ingress should enforce rate limits across instances and replace untrusted forwarded-IP headers. Retries of an unchanged enquiry reuse a provider idempotency key. Enquiry contents are not logged by the endpoint. The public-phase gates for `/api/auth` and `/api/trpc` leave `/api/enquiry` available; those dormant APIs are not required for the enquiry form.
