import { Resend } from "resend";
import { env } from "@/lib/env";
import { reactResetPasswordEmail } from "./reset-password";

/**
 * Send a password reset email via Resend.
 * Falls back to logging the reset link when RESEND_API_KEY is not configured
 * (useful in development).
 */
export async function sendResetPasswordEmail({
  user,
  url,
}: {
  user: { email: string; name: string };
  url: string;
}) {
  if (!env.RESEND_API_KEY) {
    console.warn(
      `RESEND_API_KEY not set — password reset link for ${user.email}: ${url}`
    );
    return;
  }

  const resend = new Resend(env.RESEND_API_KEY);
  await resend.emails.send({
    from: env.BETTER_AUTH_EMAIL ?? "onboarding@resend.dev",
    to: user.email,
    subject: "Reset your password",
    react: reactResetPasswordEmail({ username: user.name, resetLink: url }),
  });
}
