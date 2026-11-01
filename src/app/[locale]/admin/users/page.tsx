import { UsersContainer } from "@/features/users/components/users-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",
  description: "Manage users and their roles.",
};

export default async function UsersPage() {
  return (
    <div className="flex-1 space-y-4 p-8">
      <UsersContainer />
    </div>
  );
}
