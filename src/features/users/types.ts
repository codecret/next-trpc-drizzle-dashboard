import { IconCash, IconUserShield } from "@tabler/icons-react";
import { User } from "@/lib/auth-client";
export type TUser = Omit<
  User,
  "createdAt" | "updatedAt" | "banExpires" | "emailVerified" | "banned"
>;

export type AddUserTypes = Omit<
  User,
  "createdAt" | "updatedAt" | "banExpires" | "emailVerified" | "banned"
> & {
  password: string;
};

export const userTypes = [
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

export const filteredUserTypes = userTypes;
