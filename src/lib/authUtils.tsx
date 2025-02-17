import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function checkAdminRole() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/auth/sign-in");
  }
  if (session?.user?.role === "user") {
    redirect("/dashboard");
  }
}

export async function checkUserRole() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user?.role === "admin") {
    redirect("/admin");
  }
}
