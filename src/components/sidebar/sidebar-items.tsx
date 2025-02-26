import { Inbox, LucideIcon, PanelsTopLeft } from "lucide-react";

export interface NavSubItem {
  title: string;
  path: string;
}

export interface NavMainItem {
  title: string;
  path: string;
  icon?: LucideIcon;
  isActive?: boolean;
  subItems?: NavSubItem[];
}

export interface NavGroup {
  id: number;
  label: string;
  items: NavMainItem[];
}

const basePath = "/admin";

export const sidebarItemsAdmin: NavGroup[] = [
  {
    id: 1,
    label: "Overview",
    items: [
      {
        title: "Overview",
        path: basePath,
        icon: PanelsTopLeft,
        isActive: true,
      },
    ],
  },
  {
    id: 2,
    label: "Employees",
    items: [
      {
        title: "All Employees",
        path: `${basePath}/all-employees`,
        icon: Inbox,
      },
      {
        title: "Add Employee",
        path: `${basePath}/add-employee`,
        icon: Inbox,
      },
    ],
  },
];

export const sidebarItemsProject: NavGroup[] = [
  {
    id: 1,
    label: "Overview",
    items: [
      {
        title: "Overview",
        path: "./overview",
        icon: PanelsTopLeft,
        isActive: true,
      },
    ],
  },
];
