import { Metadata } from "next";
import { checkAdminRole } from "@/utils/authUtils";
import { EmployeeContainer } from "@/features/users/components/employee-container";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default async function AllEmployees() {
  await checkAdminRole();

  return (
    <div className="flex-1 space-y-4 p-8">
      <EmployeeContainer />
    </div>
  );
}
