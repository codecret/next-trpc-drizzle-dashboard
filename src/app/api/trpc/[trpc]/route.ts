import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server";
import { createTRPCContext } from "@/lib/trpc/init";

/**
 * tRPC API Route Handler
 * @see https://trpc.io/docs/server/adapters/fetch
 */
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ headers: req.headers }),
    onError: ({ path, error }) => {
      // Log server-side errors; expected client errors (4xx) stay quiet
      if (error.code === "INTERNAL_SERVER_ERROR") {
        console.error(`tRPC failed on ${path ?? "<no-path>"}:`, error);
      } else if (process.env.NODE_ENV === "development") {
        console.warn(`tRPC error on ${path ?? "<no-path>"}: ${error.message}`);
      }
    },
  });

export { handler as GET, handler as POST };
