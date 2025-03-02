import { EmployeeContainer } from "@/features/users/components/employee-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default async function AllEmployees() {
  return (
    <div className="flex-1 space-y-4 p-8">
      <EmployeeContainer />
    </div>
  );
}
