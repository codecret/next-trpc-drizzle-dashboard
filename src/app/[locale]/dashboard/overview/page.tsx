import { getTranslations } from "next-intl/server";
export default async function UserDashboard() {
  const t = await getTranslations("Dashboard");
  return (
    <div className="flex-1 space-y-4 px-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {t("overview.title")}
        </h2>
      </div>
    </div>
  );
}
