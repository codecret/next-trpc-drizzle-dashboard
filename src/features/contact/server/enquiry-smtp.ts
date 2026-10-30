import type { SendMailOptions, SentMessageInfo } from "nodemailer";
import type { EnquiryValues } from "../types";
import { formatEnquiryMessage } from "./enquiry-message";

export async function sendSmtpEnquiry({
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
  send: (
    message: SendMailOptions
  ) => Promise<Pick<SentMessageInfo, "messageId" | "accepted" | "rejected">>;
}): Promise<boolean> {
  try {
    const result = await send({
      from,
      to,
      replyTo: values.email,
      subject: "New SFGT website enquiry",
      text: formatEnquiryMessage(values),
      // Stable on retry, but SMTP does not provide provider-level idempotency.
      messageId: `<sfgt-enquiry-${requestId}@${from.split("@")[1]}>`,
      disableFileAccess: true,
      disableUrlAccess: true,
    });
    const accepted = result.accepted?.some(
      (recipient: string | { address: string }) =>
        (typeof recipient === "string"
          ? recipient
          : recipient.address
        ).toLowerCase() === to.toLowerCase()
    );
    return Boolean(result.messageId && accepted);
  } catch {
    // Mailbox credentials, provider errors and enquiry contents stay server-side.
    return false;
  }
}
