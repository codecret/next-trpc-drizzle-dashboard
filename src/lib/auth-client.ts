import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react
import { adminClient, usernameClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.BASE_URL,
  plugins: [usernameClient(), adminClient()],
});
