import { db } from "@/db/index";
import { account, session, users, verification } from "@/db/schema/user";
import { env } from "@/lib/env";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, username } from "better-auth/plugins";
import { resend } from "./email/resend";
import { reactResetPasswordEmail } from "./email/reset-password";

// check https://www.better-auth.com/ for more information
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user: users, account, session, verification },
  }),
  user: {
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      role: {
        type: ["user", "admin", "superadmin"],
      },
    },
  },
  plugins: [username(), admin(), nextCookies()],
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: env.BETTER_AUTH_EMAIL,
        to: user.email,
        subject: "Reset your password",
        react: reactResetPasswordEmail({
          username: user.email,
          resetLink: url,
        }),
      });
    },
  },
});
