import { Context } from "@/lib/trpc/init";
import { initTRPC } from "@trpc/server";

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
