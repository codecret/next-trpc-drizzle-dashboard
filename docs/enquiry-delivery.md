# Website enquiries

The supplier homepage and Contact page now use the same React Hook Form/Zod `EnquiryForm` and `POST /api/enquiry`, in English and Arabic. The homepage form is server-rendered in the quotation section; there is no second mailto implementation in the app runtime.

## Buyer experience

- Name, reply email and requirements are required. Division, company, product, quantity and destination are optional.
- Homepage product/division quote links prefill the form without discarding an unfinished enquiry. Additional products are appended once, shown above the fields and can be removed. Product-page links continue to prefill the Contact form.
- When sending is configured, the button says **Send enquiry** and posts directly to the server. Only provider acceptance returns a success confirmation. It does not prove that a human read the message or that the inbox received it.
- Validation, timeout and provider errors preserve the entered values. An explicit **Use email instead** action prepares a draft. Nothing is automatically retried through another provider.
- Without delivery configuration, the form clearly says **Open email draft** and explains that the visitor must send it in their email application. Copying is available as a fallback; success is never simulated.

## Enable delivery through the existing MXroute provider

Set these **server-only** environment variables in the deployment environment, then redeploy:

| Variable | Value/purpose |
| --- | --- |
| `CONTACT_FROM_EMAIL` | Authorised sender: `tbts@sfgt-tbts.com` (selected by the owner) |
| `CONTACT_SMTP_HOST` | `sunfire.mxrouting.net` for the existing SFGT MXroute server |
| `CONTACT_SMTP_PORT` | `465` (TLS; default) or `587` (required STARTTLS) |
| `CONTACT_SMTP_USER` | Full sender mailbox address |
| `CONTACT_SMTP_PASSWORD` | That mailbox’s password, entered through the hosting environment-variable UI |

The owner selected the existing `tbts@sfgt-tbts.com` mailbox. Keep its authorised credentials in server-only environment configuration; never put them in `NEXT_PUBLIC_*`, commit them, or expose them to client code. Certificate verification remains enabled. SMTP debug logging is off. No mailbox, DNS record or external account is created or changed by this implementation.

Enquiries go only to `company.email` in `src/features/catalogue/catalogue.ts`, currently `tbts@sfgt-tbts.com`. The visitor’s address is **Reply-To**, not the sender. The server does not accept a recipient from the browser.

## Existing Resend alternative

If SMTP is not configured, direct delivery can use `RESEND_API_KEY` plus `CONTACT_FROM_EMAIL` on a domain verified by that Resend account. Fully configured SMTP takes precedence over Resend. Sending failures do not trigger automatic provider fallback because an uncertain result could create duplicate messages.

Mailbox hosting and website sending are separate. Do not replace existing MX, SPF or DKIM records to enable the website sender. Any necessary DNS additions need to be considered against the current mail setup.

## Verification and limits

Run `node --import tsx --test scripts/check-enquiry.ts`. Tests use mocks and send no messages. They cover schema validation, preserved product selection, EN/AR homepage extraction, request-size/origin checks, provider acceptance and rejection, fixed mail routing, and throttling.

The endpoint uses bounded JSON, a honeypot, strict field validation and a bounded per-process throttle. Production ingress should rate-limit across instances and replace untrusted forwarded-IP headers. Enquiry contents and provider credentials are not logged by the endpoint.

Unchanged client retries reuse their request ID. Resend enforces the provider idempotency key. SMTP receives a stable Message-ID, but SMTP has no equivalent guaranteed idempotency: an ambiguous timeout followed by a retry can duplicate a message. No automatic retry is performed.

On 30 October 2026, the selected MXroute sender was configured in the ignored local environment file. SMTP connection, TLS and mailbox authentication passed without sending an email. The owner-approved test was submitted through the local homepage form on 30 October 2026 at 10:23 UTC. The form showed its success state, and read-only IMAP verification confirmed receipt in the `tbts@sfgt-tbts.com` inbox with `Reply-To: info@nxfold.com`. No reply or additional test message was sent. Production environment configuration and deployment remain outstanding; local verification does not assert that the live website has changed.
