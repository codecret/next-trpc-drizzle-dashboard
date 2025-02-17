"use client";

import * as React from "react";

import { AudioWaveform, Command, GalleryVerticalEnd } from "lucide-react";

import { TeamSwitcher } from "@/components/admin/dashboard/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { sidebarItemsAdmin, sidebarItemsProject } from "./sidebar-items";

import SidebarNavigation from "./sidebar-navigation";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import Image from "next/image";

const projects = [
  {
    name: "Project 1",
    logo: GalleryVerticalEnd,
    plan: "Enterprise",
  },
  {
    name: "Project 1",
    logo: AudioWaveform,
    plan: "Startup",
  },
  {
    name: "Project 3",
    logo: Command,
    plan: "Free",
  },
];

export function AppSidebar({
  isAdmin,
  ...props
}: React.ComponentProps<typeof Sidebar> & { isAdmin: boolean }) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        {isAdmin ? (
          <SidebarMenuItem className="mt-4 list-none">
            <Collapsible key={"logo"} asChild className="group/collapsible">
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={"logo"}>
                  <div className="relative max-w-[40px] max-h-[40px] min-w-[20px] h-[20px]">
                    <Image src={"/freelogo.png"} alt="logo" fill />
                  </div>
                  <span>Logo</span>
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </Collapsible>
          </SidebarMenuItem>
        ) : (
          <SidebarMenuItem className="list-none space-x-2">
            <TeamSwitcher projects={projects} />
          </SidebarMenuItem>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavigation
          sidebarItems={isAdmin ? sidebarItemsAdmin : sidebarItemsProject}
        />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
