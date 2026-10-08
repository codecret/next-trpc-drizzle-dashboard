import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  categoryBySlug,
  productBySlug,
  localize,
} from "@/features/catalogue/catalogue";
import { pageMetadata } from "@/features/catalogue/metadata";
import {
  CatalogueBrowser,
  type CatalogueQuery,
} from "@/features/catalogue/components/catalogue-browser";
import { ProductDetail } from "@/features/catalogue/components/product-detail";
import { BatteryCatalogue } from "@/features/catalogue/components/battery-catalogue";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export async function generateMetadata({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  const product = productBySlug.get(slug);
  const category = categoryBySlug.get(slug);
  if (!product && !category) notFound();
  const query = await searchParams;
  const t = await getTranslations({ locale, namespace: "Website.catalogue" });
  return pageMetadata({
    title: product?.name || localize(category!.name, locale),
    description: product
      ? product.description.join(" ").slice(0, 160) ||
        t("commodityDescription", { product: product.name })
      : localize(category!.description, locale),
    path: `/products/${slug}`,
    locale,
    image: product?.images[0] || category?.image,
    noIndex: Boolean(category && Object.values(query).some(Boolean)),
  });
}
export default async function CataloguePage({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  const product = productBySlug.get(slug);
  if (product) return <ProductDetail product={product} locale={locale} />;
  const category = categoryBySlug.get(slug);
  if (!category) notFound();
  const raw = await searchParams;
  const query: CatalogueQuery = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ])
  );
  if (category.slug === "batteries") {
    return (
      <BatteryCatalogue category={category} query={query} locale={locale} />
    );
  }
  if (category.slug === "alkaline-batteries") {
    const t = await getTranslations({ locale, namespace: "Website.batteries" });
    return (
      <CatalogueBrowser
        category={category}
        query={query}
        locale={locale}
        intro={{ layout: "compact", description: t("alkalineIntro") }}
      />
    );
  }
  return <CatalogueBrowser category={category} query={query} locale={locale} />;
}
