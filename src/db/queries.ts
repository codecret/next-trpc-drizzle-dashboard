import { db } from ".";
import { users } from "./schema/user";
import { auth } from "@/lib/auth";
import { authClient, User } from "@/lib/auth-client";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
interface GetAllUsersParams {
  searchEmployee?: string;
}

export async function getAllUsers({ searchEmployee }: GetAllUsersParams) {
  return (await authClient.admin.listUsers({
    fetchOptions: {
      headers: await headers(),
    },
    query: {
      searchField: "name",
      searchOperator: "contains",
      searchValue: searchEmployee,
      limit: 10,
      sortBy: "createdAt",
      sortDirection: "desc",
    },
  })) as unknown as Promise<{ users: User[] }>;
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
