import { AddEmployeeForm } from "@/components/admin/AddEmployeeForm";
import { checkAdminRole } from "@/lib/authUtils";

export default async function AddEmployeePage() {
  await checkAdminRole();
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <AddEmployeeForm />
    </div>
  );
}
