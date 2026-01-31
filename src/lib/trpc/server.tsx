import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { headers } from "next/headers";
import { cache } from "react";

import { createCallerFactory, createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import { appRouter } from "@/server";

/**
 * Create a stable getter for the query client that
 * will return the same client during the same request.
 */
export const getQueryClient = cache(makeQueryClient);

/**
 * Create a server-side caller that properly forwards request headers
 */
const createCaller = createCallerFactory(appRouter);

const caller = createCaller(async () => {
  const requestHeaders = await headers();
  return createTRPCContext({ headers: requestHeaders });
});

/**
 * Server-side tRPC helpers for React Server Components
 * - trpc: Use for calling procedures in Server Components
 * - HydrateClient: Wrap Client Components to hydrate prefetched data
 */
export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  caller,
  getQueryClient
);
