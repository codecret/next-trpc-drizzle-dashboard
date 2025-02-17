# Zero setup. Edge ready.

Opinionated NextJS 15.1.7 (App Router) template that contains everything you need for developing a full-stack applications.

![Preview](/image-preview.jpeg)

## Features

- TypeScript
- tRPC
- Drizzle ORM
- Postgresql
- Better Auth
- ESLint
- TailwindCSS
- ShadCN/ui
- Zod
- Prettier

## Usage

Create new app

```bash
yarn create-next-app@latest my-app -e https://github.com/codecret/next-trpc-drizzle-dashboard.git
# or
npx create-next-app@latest my-app -e https://github.com/codecret/next-trpc-drizzle-dashboard.git
# or
pnpm dlx create-next-app@latest my-app -e https://github.com/codecret/next-trpc-drizzle-dashboard.git
```

Add environment variables

```env
BETTER_AUTH_SECRET=""
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://[username]:[password]@localhost:port/[databasename]
```

Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Happy hacking!
