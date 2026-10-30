import type {
  CreateEmailOptions,
  CreateEmailRequestOptions,
  CreateEmailResponse,
} from "resend";
import type { EnquiryValues } from "../types";

type SendEmail = (
  payload: CreateEmailOptions,
  options: CreateEmailRequestOptions
) => Promise<CreateEmailResponse>;

export async function sendEnquiryMessage({
  values,
  requestId,
  from,
  to,
  send,
}: {
  values: EnquiryValues;
  requestId: string;
  from: string;
  to: string;
  send: SendEmail;
}): Promise<boolean> {
  const text = formatEnquiryMessage(values);

  try {
    const result = await send(
      {
        from,
        to,
        replyTo: values.email,
        subject: "New SFGT website enquiry",
        text,
      },
      { idempotencyKey: `sfgt-enquiry/${requestId}` }
    );
    // A fulfilled SDK call can still contain a provider error.
    return !result.error && Boolean(result.data?.id);
  } catch {
    // Do not log enquiry contents or expose provider details to visitors.
    return false;
  }
}

export function formatEnquiryMessage(values: EnquiryValues): string {
  return [
    "New enquiry from the SFGT website",
    "",
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    `Phone: ${values.phone || "Not provided"}`,
    `Division: ${values.division || "General enquiry"}`,
    `Company: ${values.company || "Not provided"}`,
    `Product: ${values.product || "Not provided"}`,
    `Quantity: ${values.quantity || "Not provided"}`,
    `Destination: ${values.destination || "Not provided"}`,
    "",
    values.message,
  ].join("\n");
}
