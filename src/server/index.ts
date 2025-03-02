import { createTRPCRouter } from "@/lib/trpc/init";
import { userRouter } from "../features/users/server/userRouter";

export const appRouter = createTRPCRouter({
  user: userRouter,
});

export type AppRouter = typeof appRouter;
