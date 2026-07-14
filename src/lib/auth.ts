import { db } from "@/db/index";
import { account, session, users, verification } from "@/db/schema/user";
import { env } from "@/lib/env";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { nextCookies } from "better-auth/next-js";
import { admin, username } from "better-auth/plugins";
import { sendResetPasswordEmail } from "@/lib/email/resend";

/**
 * Better Auth configuration
 * @see https://www.better-auth.com/docs
 */
export const auth = betterAuth({
  /**
   * Database adapter configuration
   */
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user: users, account, session, verification },
  }),

  /**
   * Base URL for authentication callbacks
   */
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,

  /**
   * Secret for signing tokens and cookies
   */
  secret: env.BETTER_AUTH_SECRET,

  /**
   * User configuration
   */
  user: {
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      role: {
        type: ["user", "admin"],
        defaultValue: "user",
      },
    },
  },

  /**
   * Session configuration
   */
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  /**
   * Plugins
   */
  plugins: [
    username(),
    admin({
      impersonationSessionDuration: 60 * 60, // 1 hour
    }),
    nextCookies(),
  ],

  /**
   * Email and password authentication
   */
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    // Sends via Resend when RESEND_API_KEY is set; logs the link otherwise
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail({ user, url });
    },
  },

  /**
   * Rate limiting configuration
   */
  rateLimit: {
    enabled: true,
    window: 60, // 1 minute window
    max: 10, // Max 10 requests per window
  },

  /**
   * Advanced options
   */
  advanced: {
    cookiePrefix: "dashboard",
    generateId: () => crypto.randomUUID(),
  },
});

/**
 * Export auth type for client usage
 */
export type Auth = typeof auth;
