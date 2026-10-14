import { z } from "zod";

type EnquiryMessages = {
  required: string;
  invalidEmail: string;
  messageMin: string;
  maxLength: string;
};

const defaultMessages: EnquiryMessages = {
  required: "This field is required.",
  invalidEmail: "Enter a valid email address.",
  messageMin: "Please include at least 10 characters.",
  maxLength: "Please shorten this field.",
};

export function createEnquirySchema(
  messages: EnquiryMessages = defaultMessages
) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, messages.required)
      .max(100, messages.maxLength),
    email: z
      .string()
      .trim()
      .email(messages.invalidEmail)
      .max(254, messages.maxLength),
    company: z.string().trim().max(150, messages.maxLength),
    product: z.string().trim().max(250, messages.maxLength),
    quantity: z.string().trim().max(250, messages.maxLength),
    destination: z.string().trim().max(150, messages.maxLength),
    message: z
      .string()
      .trim()
      .min(10, messages.messageMin)
      .max(3000, messages.maxLength),
    website: z.string().max(0),
  });
}

export type EnquiryValues = z.infer<ReturnType<typeof createEnquirySchema>>;
