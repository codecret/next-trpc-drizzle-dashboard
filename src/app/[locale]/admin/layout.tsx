import React, { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserNav } from "@/features/admin-dashboard/components/user-nav";
import { ToggleTheme } from "@/components/toogle-theme";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { User } from "better-auth";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

interface LayoutProps {
  readonly children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function Layout({ children, params }: LayoutProps) {
  const { user } = (await auth.api.getSession({
    headers: await headers(),
  })) as { user: User };
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  return (
    <main>
      <SidebarProvider>
        <AppSidebar isAdmin={true} />
        <SidebarInset className="mx-auto max-w-screen-2xl">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex justify-between items-center gap-2 pl-8 pr-12 w-full">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="w-fit flex gap-2 items-center">
                <ToggleTheme />
                <UserNav user={user} />
              </div>
            </div>
          </header>
          <div className="p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
