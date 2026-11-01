# CLAUDE.md

Admin dashboard boilerplate: Next.js 16 (App Router) + tRPC 11 + Drizzle ORM (PostgreSQL) + Better Auth + next-intl + shadcn/ui.

## Commands

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run lint` / `npm run typecheck` — checks (run both before committing)
- `npm run db:push` — push schema (dev); `db:generate` + `db:migrate` for migrations; `db:studio` — Drizzle Studio

## Architecture

- **Routing:** all pages live under `src/app/[locale]/` (en/de via next-intl). `src/proxy.ts` is the middleware: redirects unauthenticated users to `/auth/sign-in`, then applies i18n routing.
- **API:** tRPC routers live per-feature in `src/features/<feature>/server/`, registered in `src/server/index.ts`. Procedures come from `src/lib/trpc/init.ts`: `publicProcedure`, `protectedProcedure` (session required), `protectedAdminProcedure` (role `admin`).
- **Auth:** Better Auth config in `src/lib/auth.ts` (admin + username plugins, roles `user`/`admin` on the user table). Client in `src/lib/auth-client.ts`. Handler at `src/app/api/auth/[...all]/route.ts`.
- **DB:** Drizzle schema in `src/db/schema/`, instance in `src/db/index.ts`, raw queries in `src/db/queries.ts`. Schema changes require `npm run db:generate`.
- **Env vars:** validated in `src/lib/env.ts` (t3-env). Always import `env` from there, never `process.env` directly. New vars must be added to the schema, `runtimeEnv`, and `.env.example`.
- **Features:** `src/features/<name>/` owns components, server router, and types for that domain. Shared UI in `src/components/` (`ui/` = shadcn, don't hand-edit heavily).
- **Translations:** `messages/en.json` and `messages/de.json` — keep both in sync when adding keys.

## Conventions

- Components: kebab-case filenames, named exports.
- Forms: React Hook Form + Zod resolver; validation schemas colocated with the form or in feature `types.ts`.
- Mutations: use `mutationHandler` from `src/utils/mutationHandler.ts` for toast success/error handling.
