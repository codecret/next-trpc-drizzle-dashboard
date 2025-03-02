import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react
import { adminClient, usernameClient } from "better-auth/client/plugins";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";
import { env } from "./env";
// check https://www.better-auth.com/ for more information
export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [
    usernameClient(),
    adminClient(),
    inferAdditionalFields<typeof auth>(),
  ],
});

export type Session = typeof authClient.$Infer.Session;
export type User = Session["user"];
