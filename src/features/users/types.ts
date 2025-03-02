import { IconCash, IconShield, IconUserShield } from "@tabler/icons-react";
import { User } from "../../lib/auth";
export interface TableUser
  extends Omit<
    User,
    "createdAt" | "updatedAt" | "banExpires" | "emailVerified" | "banned"
  > {
  id: string;
  username?: string;
  password?: string;
}

export type TableUserRow = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "user" | "admin" | "superadmin";
  password: string;
  image: string;
};

export type AddUserTypes = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "user" | "admin" | "superadmin";
  password: string;
  image: string;
};

export const userTypes = [
  {
    label: "Superadmin",
    value: "superadmin",
    icon: IconShield,
  },
  {
    label: "Admin",
    value: "admin",
    icon: IconUserShield,
  },
  {
    label: "Employee",
    value: "user",
    icon: IconCash,
  },
] as const;

export const filteredUserTypes = userTypes.filter(
  (user) => user.value !== "superadmin"
);
