import { LinkProps } from "@tanstack/react-router";

interface BaseNavItem {
  title: string;
  badge?: string;
  icon?: React.ElementType;
}

type NavLink = BaseNavItem & {
  url: string;
  items?: never;
};

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: LinkProps["to"] })[];
  url?: never;
};

type NavItem = NavCollapsible | NavLink;

interface NavGroupTypes {
  title: string;
  items: NavItem[];
}

export type { NavGroupTypes, NavItem, NavCollapsible, NavLink };
