import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Environment variable validation using @t3-oss/env-nextjs
 * @see https://env.t3.gg/docs/nextjs
 */
export const env = createEnv({
  /**
   * Server-side environment variables schema
   * These are only available on the server
   */
  server: {
    // Database
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (url) => url.startsWith("postgres"),
        "DATABASE_URL must be a PostgreSQL connection string"
      ),

    // Authentication
    BETTER_AUTH_SECRET: z
      .string()
      .min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),

    BETTER_AUTH_EMAIL: z.string().optional(),

    // Email (optional - uncomment when ready to use)
    // RESEND_API_KEY: z.string().min(1),

    // Node environment
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },

  /**
   * Client-side environment variables schema
   * These are available on both client and server
   * Must be prefixed with NEXT_PUBLIC_
   */
  client: {
    NEXT_PUBLIC_BETTER_AUTH_URL: z.string().url(),
  },

  /**
   * Runtime environment mapping
   * Map environment variables to the schema
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_EMAIL: process.env.BETTER_AUTH_EMAIL,
    // RESEND_API_KEY: process.env.RESEND_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  },

  /**
   * Skip validation in certain environments
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Treat empty strings as undefined
   */
  emptyStringAsUndefined: true,
});
