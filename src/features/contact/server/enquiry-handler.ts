import { createHash } from "node:crypto";
import { z } from "zod";
import { createEnquirySchema, type EnquiryValues } from "../types";

const maxBodyBytes = 24_576;
const windowMs = 10 * 60 * 1000;
const submissionSchema = createEnquirySchema()
  .extend({ requestId: z.string().uuid() })
  .strict();

type EnquiryError =
  | "NOT_CONFIGURED"
  | "INVALID_INPUT"
  | "FORBIDDEN"
  | "RATE_LIMITED"
  | "DELIVERY_FAILED";

function failure(error: EnquiryError, status: number) {
  return Response.json(
    { error },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        ...(status === 429 ? { "Retry-After": String(windowMs / 1000) } : {}),
      },
    }
  );
}

// This bounded limiter protects one Node process. Production ingress should
// additionally rate-limit across instances and replace client-supplied IP headers.
export function createEnquiryLimiter(now: () => number = Date.now) {
  const attempts = new Map<string, { count: number; expiresAt: number }>();
  return (key: string, limit: number): boolean => {
    const time = now();
    for (const [entryKey, entry] of attempts) {
      if (entry.expiresAt <= time) attempts.delete(entryKey);
    }
    const previous = attempts.get(key);
    if (previous) {
      if (previous.count >= limit) return false;
      previous.count += 1;
      return true;
    }
    if (attempts.size >= 1000) return false;
    attempts.set(key, { count: 1, expiresAt: time + windowMs });
    return true;
  };
}

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

async function readBoundedJson(request: Request): Promise<unknown> {
  const length = request.headers.get("content-length");
  if (length && (!/^\d+$/.test(length) || Number(length) > maxBodyBytes)) {
    throw new Error("Invalid request size");
  }
  if (!request.body) throw new Error("Missing body");

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBodyBytes) {
        await reader.cancel();
        throw new Error("Request too large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const body = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(body));
}

export function createEnquiryHandler({
  enabled,
  deliver,
  canonicalOrigin,
  limit = createEnquiryLimiter(),
}: {
  enabled: () => boolean;
  deliver: (values: EnquiryValues, requestId: string) => Promise<boolean>;
  canonicalOrigin?: string;
  limit?: ReturnType<typeof createEnquiryLimiter>;
}) {
  return async (request: Request): Promise<Response> => {
    const origin = request.headers.get("origin");
    const allowedOrigins = new Set([new URL(request.url).origin]);
    if (canonicalOrigin) allowedOrigins.add(new URL(canonicalOrigin).origin);
    if (
      !origin ||
      !allowedOrigins.has(origin) ||
      request.headers.get("sec-fetch-site") === "cross-site"
    ) {
      return failure("FORBIDDEN", 403);
    }
    if (
      request.headers
        .get("content-type")
        ?.split(";")[0]
        .trim()
        .toLowerCase() !== "application/json"
    ) {
      return failure("INVALID_INPUT", 415);
    }
    if (!enabled()) return failure("NOT_CONFIGURED", 503);

    const address = (
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "unknown"
    ).slice(0, 128);
    if (!limit("global", 100) || !limit(`ip:${hash(address)}`, 10)) {
      return failure("RATE_LIMITED", 429);
    }

    let input: unknown;
    try {
      input = await readBoundedJson(request);
    } catch {
      return failure("INVALID_INPUT", 400);
    }
    if (typeof input !== "object" || !input || Array.isArray(input)) {
      return failure("INVALID_INPUT", 400);
    }
    const parsed = submissionSchema.safeParse({
      division: "",
      company: "",
      phone: "",
      product: "",
      quantity: "",
      destination: "",
      website: "",
      ...input,
    });
    if (!parsed.success) return failure("INVALID_INPUT", 400);

    const { requestId, ...values } = parsed.data;
    if (!limit(`email:${hash(values.email.toLowerCase())}`, 3)) {
      return failure("RATE_LIMITED", 429);
    }
    try {
      if (!(await deliver(values, requestId))) {
        return failure("DELIVERY_FAILED", 502);
      }
    } catch {
      return failure("DELIVERY_FAILED", 502);
    }
    return Response.json(
      { success: true },
      { headers: { "Cache-Control": "no-store" } }
    );
  };
}
