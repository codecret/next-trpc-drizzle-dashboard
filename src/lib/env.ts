import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
export const env = createEnv({
  server: {
    DATABASE_URL: z.string(),
    BETTER_AUTH_EMAIL: z
      .string()
      .email()
      .optional()
      .default("Acme <onboarding@resend.dev>"),
    BETTER_AUTH_SECRET: z.string().min(1),
    // RESEND_API_KEY: z.string().min(1),
  },
  shared: {
    NEXT_PUBLIC_BETTER_AUTH_URL: z.string(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_EMAIL: process.env.BETTER_AUTH_EMAIL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    // RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  },
});
