import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type ServerSession = Awaited<ReturnType<typeof auth.api.getSession>>;

/**
 * Get the current session directly from Better Auth (no HTTP roundtrip).
 * Server-side only.
 */
export const getSession = async (): Promise<ServerSession> => {
  return auth.api.getSession({ headers: await headers() });
};

export async function checkAuth() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  return session;
}

export async function isAdminSession({
  or,
}: {
  or: (session: NonNullable<ServerSession>) => void;
}) {
  const session = await checkAuth();

  if (session.user.role !== "admin") {
    or(session);
  }
}

export async function isUserSession({
  or,
}: {
  or: (session: NonNullable<ServerSession>) => void;
}) {
  const session = await checkAuth();

  if (session.user.role !== "user") {
    or(session);
  }
}
