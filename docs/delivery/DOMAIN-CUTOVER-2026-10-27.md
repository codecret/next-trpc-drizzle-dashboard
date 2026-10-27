# SFGT domain connection — 27 October 2026

Connected `sfgt-tbts.com` and `www.sfgt-tbts.com` to the existing Vercel project `sfgt-website` in team `info-74763197`.

## DNS changes

| Record | Previous value | New value | TTL |
| --- | --- | --- | --- |
| A `@` | `184.168.28.240` | `216.198.79.1` | 600 seconds |
| CNAME `www` | `sfgt-tbts.com.` | `1be79ebfea9c3327.vercel-dns-017.com.` | 1 hour |

Targets were read from the project's Vercel domain settings. The user explicitly approved the www update. Comparing all 19 records before and after confirmed that only these two values changed. Nameservers, email records, commodities, toshiba, and mssql records were preserved. Snapshots are in `dns-before-2026-10-27.txt` and `dns-after-2026-10-27.txt`.

## Application configuration

Updated production `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_BETTER_AUTH_URL` to `https://sfgt-tbts.com`. Rebuilt the existing approved deployment's source, without deploying the local working tree or Git HEAD.

- Previous deployment: `dpl_2ZM1ic8Zst8knJg4u1wWuBsvj6e2`
- New production deployment: `dpl_9TDA1vdAUBR8P7xznsHQb7zCUwyN`
- New deployment URL: `https://sfgt-website-6k7a72ja8-info-74763197.vercel.app`
- Verified production status: Ready

## Verification

- Vercel reports Valid Configuration for both custom hostnames.
- Both HTTPS homepages load the approved “Batteries, lighting and commodity trading” design.
- Both homepages declare `https://sfgt-tbts.com` as the canonical URL.
- `/sitemap.xml` returns HTTP 200 with 550 URLs, all on `sfgt-tbts.com`.
- `/robots.txt` returns HTTP 200 and references `https://sfgt-tbts.com/sitemap.xml`.
- Both hostnames currently serve the website directly. An optional 308 www-to-root redirect was not applied: automatic approval review requires separate explicit authorization for that routing change; the unsaved form was cancelled.

No mailbox migration, password changes, registrar transfer, nameserver change, or email delivery test was performed during this domain connection. Previous mailbox authentication problems remain unresolved.

## Rollback references

The saved DNS snapshots retain the old website targets. Restore only the two website record values if a DNS rollback is needed; do not replace or remove mail records. The previous Vercel deployment remains the reference for application rollback. These are recovery references, not authorization to roll back.
