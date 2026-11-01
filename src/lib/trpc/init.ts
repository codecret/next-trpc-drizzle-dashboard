import { cache } from "react";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import * as z from "zod";
import { auth } from "../auth";
import { headers } from "next/headers";

/**
 * Context creation for tRPC
 * This is called for each request and provides shared data to all procedures
 */
export const createTRPCContext = cache(async (opts: { headers: Headers }) => {
  return {
    headers: opts.headers,
  };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

/**
 * tRPC initialization with production-ready configuration
 */
const t = initTRPC.context<Context>().create({
  /**
   * Data transformer for proper serialization of dates, Maps, Sets, etc.
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,

  /**
   * Error formatter for better error handling in production
   * @see https://trpc.io/docs/server/error-formatting
   */
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof z.ZodError
            ? z.flattenError(error.cause)
            : null,
      },
    };
  },
});

/**
 * Server-side caller factory for calling procedures directly
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * Router factory for creating routers
 */
export const createTRPCRouter = t.router;

/**
 * Middleware factory
 */
export const middleware = t.middleware;

/**
 * Public procedure - no authentication required
 */
export const publicProcedure = t.procedure;

/**
 * Reusable middleware to check if user is authenticated
 */
const isAuthenticated = middleware(async ({ next }) => {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }

  return next({
    ctx: {
      session,
      user: session.user,
    },
  });
});

/**
 * Protected procedure - requires authenticated user
 */
export const protectedProcedure = t.procedure.use(isAuthenticated);

/**
 * Reusable middleware to check if user is admin
 */
const isAdmin = middleware(async ({ next }) => {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }

  if (session.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You must be an admin to access this resource",
    });
  }

  return next({
    ctx: {
      session,
      user: session.user,
    },
  });
});

/**
 * Admin procedure - requires admin role
 */
export const protectedAdminProcedure = t.procedure.use(isAdmin);
