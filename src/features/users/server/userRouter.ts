import { db } from "@/db";
import { deleteUserById, getAllUsers, getUserById } from "@/db/queries";
import { account, users } from "@/db/schema/user";
import { auth } from "@/lib/auth";
import { protectedAdminProcedure } from "@/lib/trpc/init";
import { getRequestSession } from "@/utils/authUtils";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";
import { publicProcedure, router } from "../../../server/trpc";

export const userRouter = router({
  getUsers: protectedAdminProcedure.query(async () => {
    return getAllUsers({});
  }),
  addUser: protectedAdminProcedure
    .input(
      z.object({
        username: z.string().min(3, {
          message: "Name must be at least 3 characters.",
        }),
        name: z.string().min(3, {
          message: "Name must be at least 3 characters.",
        }),
        email: z.string().email(),
        password: z
          .string()
          .min(5, "password should be at least 5 digits long."),
        role: z.enum(["admin", "user", "superadmin"], {
          message: "Role must be either 'admin' or 'user'.",
        }),
      })
    )
    .mutation(async ({ input }) => {
      const newUser = await auth.api.createUser({
        headers: await headers(),
        body: {
          name: input.name,
          email: input.email,
          password: input.password,
          role: input.role,
          data: {
            username: input.username,
          },
        },
      });
      return newUser;
    }),
  editUser: protectedAdminProcedure
    .input(
      z.object({
        userId: z.string(),
        username: z.string().optional(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        password: z
          .string()
          .min(5, "password should be at least 5 digits long.")
          .optional(),
        role: z.enum(["admin", "user", "superadmin"]),
      })
    )
    .mutation(async ({ input }) => {
      const ctx = await auth.$context;
      const { password } = input;
      if (password) {
        const passwordInput = await ctx.password.hash(password);
        await db
          .update(account)
          .set({
            password: passwordInput,
          })
          .where(eq(account.userId, input.userId));
      }
      const updatedUser = await db
        .update(users)
        .set({
          email: input.email,
          username: input.username,
          name: input.name,
          role: input.role,
        })
        .where(eq(users.id, input.userId));

      return updatedUser;
    }),
  userById: protectedAdminProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const id = input;
      const user = await getUserById(id);
      return user;
    }),
  deleteUserId: protectedAdminProcedure
    .input(z.string().min(1, { message: "User ID is required." })) // Validate that userId is not empty
    .mutation(async ({ input: id }) => {
      return deleteUserById(id);
    }),
  getCurrentUser: publicProcedure.query(async ({ ctx }) => {
    return getRequestSession(ctx.req);
  }),
});
