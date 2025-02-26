import { UserWithRole } from "better-auth/plugins";
import { IconCash, IconShield, IconUserShield } from "@tabler/icons-react";

export interface TableUser
  extends Omit<UserWithRole, "createdAt" | "updatedAt" | "banExpires"> {
  id: string;
}

export type AddUserTypes = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: Extract<(typeof filteredUserTypes)[number]["value"], string>;
  password: string;
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
