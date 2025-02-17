import { checkUserRole } from "@/lib/authUtils";

export default async function UserDashboard() {
  await checkUserRole();
  return (
    <div className="flex-1 space-y-4 px-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">My Dashboard</h2>
      </div>
    </div>
  );
}
