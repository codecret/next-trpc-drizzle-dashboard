import { db } from ".";
import { users } from "./schema/user";
import { auth } from "@/lib/auth";
import { eq, ilike, or } from "drizzle-orm";
import { headers } from "next/headers";
interface GetAllUsersParams {
  searchEmployee?: string;
}
// Fetch all users
export async function getAllUsers({ searchEmployee }: GetAllUsersParams) {
  return await db
    .select()
    .from(users)
    .where(or(ilike(users.name, `%${searchEmployee}`)));
}
export async function getUserById(id: string) {
  return db.query.users.findFirst({ where: eq(users.id, id) });
}

export async function deleteUserById(id: string) {
  try {
    // Call the Better Auth API to remove the user
    const result = await auth.api.removeUser({
      headers: await headers(),
      body: {
        userId: id,
      },
    });

    // Check if the user was successfully removed
    if (!result) {
      throw new Error("Failed to remove user. Please try again.");
    }

    // Return a success message or the result
    return {
      success: true,
      message: "User removed successfully.",
      data: result,
    };
  } catch (error) {
    // Handle errors gracefully
    throw new Error(
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while removing the user."
    );
  }
}
