import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react
import { adminClient, usernameClient } from "better-auth/client/plugins";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.BASE_URL,
  plugins: [
    inferAdditionalFields<typeof auth>(),
    usernameClient(),
    adminClient(),
  ],
});
