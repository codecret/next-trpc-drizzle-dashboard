import { userRouter } from "../features/users/server/userRouter";
import { router } from "./trpc";

export const appRouter = router({
  user: userRouter,
});

export type AppRouter = typeof appRouter;
