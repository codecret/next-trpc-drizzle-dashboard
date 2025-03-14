import { cache } from "react";
import { initTRPC, TRPCError } from "@trpc/server";
import { getSessionCookie } from "better-auth/cookies";
import { auth } from "../auth";
import { headers } from "next/headers";

export const createTRPCContext = cache(async ({ req }: { req: Request }) => {
  return { req };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

// Avoid exporting the entire t-object since it's not very descriptive.
// For instance, the use of a t variable is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  //   transformer: superjson,
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  const { req } = ctx;
  const user = getSessionCookie(req);

  const token = req.headers
    .get("cookie")
    ?.match(/better-auth\.session_token=([^;]*)/)?.[1];

  if (!user || !token) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next();
});

export const protectedAdminProcedure = t.procedure.use(
  async ({ ctx, next }) => {
    const { req } = ctx;
    const user = getSessionCookie(req);
    const session = await auth.api.getSession({ headers: await headers() });
    const role = session?.user.role;

    const token = req.headers
      .get("cookie")
      ?.match(/better-auth\.session_token=([^;]*)/)?.[1];

    if (!user || !token || role !== "admin") {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next();
  }
);
