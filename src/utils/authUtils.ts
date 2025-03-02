// TODO: impl authorization with casl.js

import { Session } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const getRequestSession = async (req: Request) => {
  return await authClient.getSession({
    fetchOptions: {
      headers: req.headers,
    },
  });
};

export const getSession = async () => {
  return await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });
};

export async function checkAuth() {
  const { data, error } = await getSession();

  if (!data || error) {
    throw redirect("/auth/sign-in");
  }

  return data;
}

export async function isAdminSession({
  or,
}: {
  or: (session?: Session) => void;
}) {
  const session = await checkAuth();

  if (session?.user?.role !== "admin") {
    or(session);
  }
}

export async function isUserSession({
  or,
}: {
  or: (session?: Session) => void;
}) {
  const session = await checkAuth();

  if (session?.user?.role !== "user") {
    or(session);
  }
}
