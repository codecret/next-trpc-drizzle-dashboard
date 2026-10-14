# Website enquiries

The homepage and contact page share the same enquiry form. Name, email and requirements are required; company, product, quantity and destination are optional. Product-page enquiry links still prefill the product field and open the optional details.

## Enable direct delivery

Set these server-side variables in the deployment environment (or `.env.local` for local use):

- `RESEND_API_KEY`: a Resend key permitted to send email.
- `CONTACT_FROM_EMAIL`: a sender email address on a domain verified in that Resend account.

Restart the application after configuring these variables; rebuild/redeploy if your host supplies environment variables during the build. Do not put credentials in public environment variables or commit them.

Enquiries always go to `company.email` in `src/features/catalogue/catalogue.ts`. The visitor's address is the reply-to address. No recipient is accepted from the browser. The provider must return an accepted message ID before the website shows a sent confirmation; this does not prove inbox delivery.

Without both variables, the form clearly offers an email draft and copy fallback. It never simulates a successful send. Provider or network failures preserve entered details and offer an explicit email fallback.

## Verification

Run `node --import tsx --test scripts/check-enquiry.ts` for mocked delivery, validation, request-size/origin, idempotency and throttling checks. These tests send no email. Verify actual delivery to the intended inbox after configuring the production sender.

The public endpoint is `POST /api/enquiry`. It validates bounded JSON, checks origin, uses a honeypot and applies a bounded per-process throttle. Deployment ingress should enforce rate limits across instances and replace untrusted forwarded-IP headers. Retries of an unchanged enquiry reuse a provider idempotency key. Enquiry contents are not logged by the endpoint.
