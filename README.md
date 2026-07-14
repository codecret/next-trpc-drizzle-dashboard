# Next.js + tRPC + Drizzle Dashboard Starter

A production-ready boilerplate for building admin dashboards with role-based access, built on Next.js 16, tRPC, Drizzle ORM, and Better Auth.

## Features

- 🔒 **Authentication** — email/password auth with Better Auth (sessions, password reset, rate limiting)
- 👥 **Role-based access** — `user` / `admin` roles enforced in middleware, layouts, and tRPC procedures
- 🛡️ **Type-safe API** — end-to-end types with tRPC 11 + Zod validation + superjson
- 🗄️ **Drizzle ORM** — PostgreSQL schema, migrations, and Drizzle Studio
- ✅ **Validated env vars** — fail-fast environment validation with `@t3-oss/env-nextjs`
- 🌍 **i18n** — English/German out of the box with next-intl (locale-prefixed routes)
- 🌗 **Light/dark mode** — via next-themes
- 📊 **Admin dashboard** — charts (Recharts), stat cards, and a users CRUD with TanStack Table
- 🧩 **shadcn/ui components** — accessible Radix-based UI, fully customizable
- 📱 Fully responsive with a collapsible sidebar

## Tech Stack

| Layer     | Technology                                                                   |
| --------- | ---------------------------------------------------------------------------- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) + React 19          |
| API       | [tRPC 11](https://trpc.io)                                                   |
| Database  | PostgreSQL + [Drizzle ORM](https://orm.drizzle.team)                         |
| Auth      | [Better Auth](https://www.better-auth.com) (admin + username plugins)        |
| UI        | [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| Forms     | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev)      |
| Tables    | [TanStack Table](https://tanstack.com/table/latest)                          |
| i18n      | [next-intl](https://next-intl.dev)                                           |
| Email     | [Resend](https://resend.com) + React Email (optional, for password reset)    |

## Getting Started

### 1. Clone and install

```sh
git clone <your-repo-url> my-app
cd my-app
npm install
```

### 2. Set up environment variables

```sh
cp .env.example .env
```

Fill in `DATABASE_URL` (PostgreSQL) and generate a secret:

```sh
openssl rand -base64 32   # → BETTER_AUTH_SECRET
```

### 3. Set up the database

Apply the committed migrations (in `drizzle/`):

```sh
npm run db:migrate
```

After changing the schema in `src/db/schema/`, generate a new migration with `npm run db:generate` and apply it with `npm run db:migrate`. For rapid prototyping you can push the schema directly with `npm run db:push` instead.

### 4. Run the dev server

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Tip:** new sign-ups get the `user` role. Promote an admin by setting `role = 'admin'` on the `user` table (e.g. via `npm run db:studio`).

## Scripts

| Script                | Description                       |
| --------------------- | --------------------------------- |
| `npm run dev`         | Start the dev server              |
| `npm run build`       | Production build                  |
| `npm run start`       | Serve the production build        |
| `npm run lint`        | Lint with ESLint                  |
| `npm run typecheck`   | TypeScript check (no emit)        |
| `npm run format`      | Format with Prettier              |
| `npm run db:push`     | Push schema to the database (dev) |
| `npm run db:generate` | Generate SQL migrations           |
| `npm run db:migrate`  | Apply migrations                  |
| `npm run db:studio`   | Open Drizzle Studio               |

## Project Structure

Feature-based structure 🗂 — each feature owns its components, server router, and types.

```
src/
├── app/
│   ├── [locale]/          # Locale-prefixed routes (en, de)
│   │   ├── page.tsx       # Landing page
│   │   ├── auth/          # Sign in / sign up / password reset
│   │   ├── admin/         # Admin dashboard + users management
│   │   └── dashboard/     # User dashboard
│   └── api/
│       ├── auth/[...all]/ # Better Auth handler
│       └── trpc/[trpc]/   # tRPC handler
├── components/            # Shared components (sidebar, ui/ = shadcn)
├── db/                    # Drizzle instance, schema, queries
├── features/              # Feature modules (landing, auth, users, admin-dashboard)
├── i18n/                  # next-intl routing + request config
├── lib/                   # auth, env validation, trpc setup, email
├── server/                # tRPC root router
├── utils/                 # Hooks and helpers
└── proxy.ts               # Middleware: auth guard + i18n routing
messages/                  # Translation files (en.json, de.json)
```

## Extending

- **Add a tRPC router:** create `src/features/<feature>/server/<name>Router.ts` and register it in `src/server/index.ts`. Use `publicProcedure`, `protectedProcedure`, or `protectedAdminProcedure` from `src/lib/trpc/init.ts`.
- **Add a table:** define it in `src/db/schema/`, then `npm run db:generate && npm run db:migrate`.
- **Add an env var:** declare it in `src/lib/env.ts` and `.env.example`.
- **Add a locale:** add the locale to `src/i18n/routing.ts` and create `messages/<locale>.json`.
- **Password reset emails:** set `RESEND_API_KEY`, uncomment `src/lib/email/resend.ts`, and wire it into `sendResetPassword` in `src/lib/auth.ts`. In development the reset link is logged to the console.

## Acknowledgments

- [Shadcn Admin Dashboard](https://github.com/satnaing/shadcn-admin) for some components.

## License

Licensed under the [MIT License](LICENSE).
