"use client";

import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavGroup } from "./sidebar-items";
import Link from "next/link";

export default function SidebarNavigation({
  sidebarItems,
}: {
  readonly sidebarItems: NavGroup[];
}) {
  return (
    <>
      {sidebarItems.map((navGroup) => (
        <SidebarGroup key={navGroup.id}>
          {navGroup.label && (
            <SidebarGroupLabel>{navGroup.label}</SidebarGroupLabel>
          )}
          <SidebarMenu>
            {navGroup.items.map((item) => {
              return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <Link href={item.path}>
                        <SidebarMenuButton tooltip={item.title}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </Link>
                    </CollapsibleTrigger>
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
