import React, { ReactNode } from "react";
import { UserNav } from "@/components/admin/dashboard/user-nav";
import { ToggleTheme } from "@/components/toogle-theme";

interface LayoutProps {
  readonly children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <main>
      <header className="flex h-16 shrink-0 items-center justify-end p-8 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="w-fit flex gap-2">
          <ToggleTheme />
          <UserNav />
        </div>
      </header>
      <div className="p-4 pt-0">{children}</div>
    </main>
  );
}
