import { getTranslations } from "next-intl/server";
import {
  CatalogueBrowser,
  type CatalogueQuery,
} from "@/features/catalogue/components/catalogue-browser";
import { pageMetadata } from "@/features/catalogue/metadata";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export async function generateMetadata({ params, searchParams }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Website.catalogue" });
  const query = await searchParams;
  return pageMetadata({
    title: t("title"),
    description: t("description"),
    path: "/products",
    locale,
    noIndex: Object.values(query).some(Boolean),
  });
}
export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const raw = await searchParams;
  const query: CatalogueQuery = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ])
  );
  return <CatalogueBrowser query={query} locale={locale} />;
}
