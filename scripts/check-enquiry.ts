/** Run with: node --import tsx --test scripts/check-enquiry.ts. No network or emails. */
import assert from "node:assert/strict";
import { test } from "node:test";
import type { CreateEmailResponse } from "resend";
import { createEnquirySchema } from "../src/features/contact/types";
import {
  createEnquiryHandler,
  createEnquiryLimiter,
} from "../src/features/contact/server/enquiry-handler";
import { sendEnquiryMessage } from "../src/features/contact/server/enquiry-message";

const values = {
  name: "Example Buyer",
  email: "buyer@example.com",
  company: "Example Company",
  product: "AA batteries",
  quantity: "100 packs",
  destination: "Dubai",
  message: "Please provide a quotation for our order.",
  website: "",
};
const requestId = "0433f48d-81ab-4f73-8060-f461c694fe10";
const payload = { ...values, requestId };
const origin = "http://localhost:4318";

function request(body: unknown = payload, headers: HeadersInit = {}) {
  return new Request(`${origin}/api/enquiry`, {
    method: "POST",
    headers: { origin, "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

function handler(
  overrides: Partial<Parameters<typeof createEnquiryHandler>[0]> = {}
) {
  return createEnquiryHandler({
    enabled: () => true,
    deliver: async () => true,
    ...overrides,
  });
}

async function expectError(response: Response, status: number, error: string) {
  assert.equal(response.status, status);
  assert.deepEqual(await response.json(), { error });
  assert.equal(response.headers.get("cache-control"), "no-store");
}

test("valid enquiry reaches delivery with normalized optional fields", async () => {
  let called = false;
  const endpoint = handler({
    deliver: async (submitted, id) => {
      called = true;
      assert.equal(submitted.name, values.name);
      assert.equal(submitted.company, "");
      assert.equal(submitted.destination, "");
      assert.equal(submitted.website, "");
      assert.equal(id, requestId);
      assert.equal("requestId" in submitted, false);
      return true;
    },
  });
  const response = await endpoint(
    request({
      name: ` ${values.name} `,
      email: values.email,
      message: values.message,
      requestId,
    })
  );
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal(called, true);
});

test("missing configuration never invokes delivery or claims success", async () => {
  const endpoint = handler({
    enabled: () => false,
    deliver: async () => assert.fail("must not deliver"),
  });
  await expectError(await endpoint(request()), 503, "NOT_CONFIGURED");
});

test("different or absent origin and cross-site requests are rejected", async () => {
  const endpoint = handler({
    deliver: async () => assert.fail("must not deliver"),
  });
  await expectError(
    await endpoint(request(payload, { origin: "https://unrelated.example" })),
    403,
    "FORBIDDEN"
  );
  await expectError(
    await endpoint(request(payload, { origin: "" })),
    403,
    "FORBIDDEN"
  );
  await expectError(
    await endpoint(request(payload, { "sec-fetch-site": "cross-site" })),
    403,
    "FORBIDDEN"
  );
});

test("configured canonical origin is accepted behind a proxy", async () => {
  const endpoint = handler({ canonicalOrigin: "https://sfgt.example" });
  assert.equal(
    (await endpoint(request(payload, { origin: "https://sfgt.example" })))
      .status,
    200
  );
});

test("non-JSON, malformed and oversized bodies cannot reach delivery", async () => {
  const endpoint = handler({
    deliver: async () => assert.fail("must not deliver"),
  });
  await expectError(
    await endpoint(request(payload, { "content-type": "text/plain" })),
    415,
    "INVALID_INPUT"
  );
  const malformed = new Request(`${origin}/api/enquiry`, {
    method: "POST",
    headers: { origin, "content-type": "application/json" },
    body: "{bad json",
  });
  await expectError(await endpoint(malformed), 400, "INVALID_INPUT");
  await expectError(
    await endpoint(request({ ...payload, message: "a".repeat(30_000) })),
    400,
    "INVALID_INPUT"
  );
  await expectError(
    await endpoint(request(payload, { "content-length": "30000" })),
    400,
    "INVALID_INPUT"
  );
});

test("invalid fields, filled honeypot and non-UUID request IDs are rejected", async () => {
  const endpoint = handler({
    deliver: async () => assert.fail("must not deliver"),
  });
  for (const change of [
    { email: "not-an-email" },
    { name: "" },
    { message: "short" },
    { destination: "x".repeat(151) },
    { website: "https://spam.example" },
    { requestId: "not-a-uuid" },
    { recipient: "someone-else@example.com" },
  ]) {
    await expectError(
      await endpoint(request({ ...payload, ...change })),
      400,
      "INVALID_INPUT"
    );
  }
});

test("provider rejection or exception yields failure, not confirmation", async () => {
  await expectError(
    await handler({ deliver: async () => false })(request()),
    502,
    "DELIVERY_FAILED"
  );
  await expectError(
    await handler({
      deliver: async () => {
        throw new Error("provider unavailable");
      },
    })(request()),
    502,
    "DELIVERY_FAILED"
  );
});

test("repeated submissions are throttled before further provider calls", async () => {
  let calls = 0;
  const endpoint = handler({
    deliver: async () => {
      calls += 1;
      return true;
    },
  });
  for (let i = 0; i < 3; i += 1)
    assert.equal((await endpoint(request())).status, 200);
  const response = await endpoint(request());
  await expectError(response, 429, "RATE_LIMITED");
  assert.equal(response.headers.get("retry-after"), "600");
  assert.equal(calls, 3);
});

test("limiter expires old entries and caps the number of retained keys", () => {
  let time = 0;
  const limit = createEnquiryLimiter(() => time);
  assert.equal(limit("first", 1), true);
  assert.equal(limit("first", 1), false);
  for (let i = 1; i < 1000; i += 1) assert.equal(limit(`key-${i}`, 1), true);
  assert.equal(limit("overflow", 1), false);
  time = 600_001;
  assert.equal(limit("first", 1), true);
  assert.equal(limit("overflow", 1), true);
});

test("delivery uses fixed routing, plain text and request idempotency", async () => {
  const sent = await sendEnquiryMessage({
    values,
    requestId,
    from: "website@example.com",
    to: "sales@example.com",
    send: async (email, options) => {
      assert.equal(email.from, "website@example.com");
      assert.equal(email.to, "sales@example.com");
      assert.equal(email.replyTo, values.email);
      assert.match(email.text ?? "", /Destination: Dubai/);
      assert.match(email.text ?? "", /Please provide a quotation/);
      assert.equal(email.html, undefined);
      assert.equal(options.idempotencyKey, `sfgt-enquiry/${requestId}`);
      return { data: { id: "mock-email-id" }, error: null, headers: null };
    },
  });
  assert.equal(sent, true);
});

test("SDK error results, missing IDs and thrown failures do not count as sent", async () => {
  const failures: CreateEmailResponse[] = [
    {
      data: null,
      error: {
        name: "application_error",
        message: "Mock failure",
        statusCode: 503,
      },
      headers: null,
    },
    { data: { id: "" }, error: null, headers: null },
  ];
  for (const response of failures) {
    assert.equal(
      await sendEnquiryMessage({
        values,
        requestId,
        from: "website@example.com",
        to: "sales@example.com",
        send: async () => response,
      }),
      false
    );
  }
  assert.equal(
    await sendEnquiryMessage({
      values,
      requestId,
      from: "website@example.com",
      to: "sales@example.com",
      send: async () => {
        throw new Error("Mock network failure");
      },
    }),
    false
  );
});

test("form schema keeps optional fields as strings and uses translated errors", () => {
  const schema = createEnquirySchema({
    required: "required",
    invalidEmail: "email",
    messageMin: "message",
    maxLength: "long",
  });
  assert.equal(schema.parse(values).company, values.company);
  const result = schema.safeParse({ ...values, name: "" });
  assert.equal(result.success, false);
  if (!result.success) assert.equal(result.error.issues[0].message, "required");
});
