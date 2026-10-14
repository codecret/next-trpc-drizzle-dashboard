import { env } from "@/lib/env";
import {
  deliverEnquiry,
  getEnquiryDeliveryEnabled,
} from "@/features/contact/server/enquiry-delivery";
import { createEnquiryHandler } from "@/features/contact/server/enquiry-handler";

export const runtime = "nodejs";

export const POST = createEnquiryHandler({
  enabled: getEnquiryDeliveryEnabled,
  deliver: deliverEnquiry,
  canonicalOrigin: env.NEXT_PUBLIC_SITE_URL ?? env.NEXT_PUBLIC_BETTER_AUTH_URL,
});
