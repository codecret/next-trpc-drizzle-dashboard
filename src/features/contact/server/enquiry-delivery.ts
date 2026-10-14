import { Resend } from "resend";
import { company } from "@/features/catalogue/catalogue";
import { env } from "@/lib/env";
import type { EnquiryValues } from "../types";
import { sendEnquiryMessage } from "./enquiry-message";

export function getEnquiryDeliveryEnabled(): boolean {
  return Boolean(env.RESEND_API_KEY && env.CONTACT_FROM_EMAIL);
}

export async function deliverEnquiry(
  values: EnquiryValues,
  requestId: string
): Promise<boolean> {
  if (!env.RESEND_API_KEY || !env.CONTACT_FROM_EMAIL) return false;

  const resend = new Resend(env.RESEND_API_KEY);
  return sendEnquiryMessage({
    values,
    requestId,
    from: env.CONTACT_FROM_EMAIL,
    to: company.email,
    send: (payload, options) => resend.emails.send(payload, options),
  });
}
