import { Resend } from "resend";
import nodemailer from "nodemailer";
import { company } from "@/features/catalogue/catalogue";
import { env } from "@/lib/env";
import type { EnquiryValues } from "../types";
import { sendEnquiryMessage } from "./enquiry-message";
import { sendSmtpEnquiry } from "./enquiry-smtp";

function smtpConfigured(): boolean {
  return Boolean(
    env.CONTACT_SMTP_HOST && env.CONTACT_SMTP_USER && env.CONTACT_SMTP_PASSWORD
  );
}

export function getEnquiryDeliveryEnabled(): boolean {
  return Boolean(
    env.CONTACT_FROM_EMAIL && (smtpConfigured() || env.RESEND_API_KEY)
  );
}

export async function deliverEnquiry(
  values: EnquiryValues,
  requestId: string
): Promise<boolean> {
  if (!env.CONTACT_FROM_EMAIL) return false;

  // Prefer the existing mailbox provider when all SMTP settings are present.
  // Never fail over automatically: an uncertain send could duplicate the enquiry.
  if (smtpConfigured()) {
    const port = Number(env.CONTACT_SMTP_PORT ?? "465");
    const transport = nodemailer.createTransport({
      host: env.CONTACT_SMTP_HOST,
      port,
      secure: port === 465,
      requireTLS: port === 587,
      auth: { user: env.CONTACT_SMTP_USER, pass: env.CONTACT_SMTP_PASSWORD },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
      disableFileAccess: true,
      disableUrlAccess: true,
      logger: false,
      debug: false,
    });
    return sendSmtpEnquiry({
      values,
      requestId,
      from: env.CONTACT_FROM_EMAIL,
      to: company.email,
      send: (message) => transport.sendMail(message),
    });
  }

  if (!env.RESEND_API_KEY) return false;

  const resend = new Resend(env.RESEND_API_KEY);
  return sendEnquiryMessage({
    values,
    requestId,
    from: env.CONTACT_FROM_EMAIL,
    to: company.email,
    send: (payload, options) => resend.emails.send(payload, options),
  });
}
