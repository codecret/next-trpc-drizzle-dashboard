# Shadcn Admin Dashboard

Admin Panel with Role-based Dashboards built with Shadcn, Drizzle, BetterAuth, and Next.js. Designed for responsiveness, accessibility, and modular
![alt text](https://github.com/user-attachments/assets/142fc3b2-2cf2-4e88-9270-e086342735a8)

---

## Features

- 🌗 Light/Dark Mode
- 📱 Fully Responsive
- ♿ Accessible UI Components
- 🏠 Built-in Sidebar Navigation
- 📊 Analytics Dashboard with Charts
- 🛠️ Extra Custom Components
- 🔒 Authentication with BetterAuth

---

## Tech Stack

- **Framework:** [Next.js 15 ](https://nextjs.org)
- **Language:** [TypeScript](https://tailwindcss.com)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **UI Components:** [ShadcnUI](https://ui.shadcn.com)
- **Schema Validation:** [Zod](https://zod.dev)
- **Authentication:** [BetterAuth](https://www.better-auth.com)
- **API Handling:** [tRPC](https://trpc.io)
- **Database ORM:** [Drizzle ORM](https://orm.drizzle.team)
- **Tables:** [TanStack Tables](https://tanstack.com/table/latest)
- **Forms:** [React Hook Form](https://react-hook-form.com)
- **Linting:** [ESLint](https://eslint.org)
- **Formatting:** [Prettier](https://prettier.io)

---

## Project Structure

Project is using feature-based structure 🗂.

## Getting Started

### Clone the repository

```sh
git clone https://github.com/codecret/next-trpc-drizzle-dashboard.git
```

Go to the project directory

```bash
cd next-trpc-drizzle-dashboard
```

### Install dependencies

```sh
npm install
```

### Run Migrations

Before running the development server, make sure to apply any pending database migrations. You can run them using the following command:

```sh
npx drizzle-kit migrate
```

### Setup environment variables

Copy the example environment file and update it with your configuration:

```sh
cp .env.example.txt .env
```

### Run the development server

```sh
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Notes

- We are using **Next.js 15** with **React 19**.
- Be cautious when pulling new updates, as changes may introduce breaking changes.
- tRPC enables seamless communication between the frontend and backend, ensuring a type-safe and efficient development experience.

---

### Crafted with 💙 by [@codecret](https://github.com/codecret)

---

## License

Licensed under the [MIT License](https://choosealicense.com/licenses/mit/)
