import { Metadata } from "next";
import { UserAuthForm } from "@/features/auth/components/user-auth-form";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Auth");
  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function Login() {
  const session = await auth.api.getSession({ headers: await headers() });

  const t = await getTranslations("Auth");
  if (session) {
    redirect("/dashboard/overview");
  }

  return (
    <>
      <div className="container relative h-screen flex px-4 flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            {t("brand")}
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">{t("signIn.tagline")}</p>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                {t("signIn.title")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("signIn.description")}
              </p>
            </div>
            <UserAuthForm />
            <div className="flex items-center">
              <Link
                href={"/auth/forgot-password"}
                className="m-auto inline-block text-sm underline"
              >
                {t("signIn.forgotPassword")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
