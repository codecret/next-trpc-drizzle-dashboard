import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { EmployeesTable } from "@/components/admin/EmployeesTable";
import { Plus } from "lucide-react";
import Link from "next/link";
import { SearchEmployee } from "@/components/admin/SearchEmployee";
import { checkAdminRole } from "@/lib/authUtils";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default async function AllEmployees() {
  await checkAdminRole();

  return (
    <div className="flex-1 space-y-4 p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">All Employee</h2>
      </div>
      <div className="flex h-16 items-center">
        <div className="flex items-center ">
          <SearchEmployee />
        </div>
      </div>
      <div className="flex-1 space-y-4">
        <div className="flex items-center space-x-2">
          <Link href="/admin/add-employee">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Employee
            </Button>
          </Link>
        </div>
      </div>
      <EmployeesTable />
    </div>
  );
}
