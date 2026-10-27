import { getTranslations } from "next-intl/server";
import { brand, company } from "@/features/catalogue/catalogue";
import { JsonLd } from "@/features/catalogue/components/json-ld";
import { pageMetadata, siteOrigin } from "@/features/catalogue/metadata";
import { SupplierHomeRuntime } from "@/features/landing/supplier-home-runtime";
import markup from "@/features/landing/supplier-home-markup.json";
import "@/features/landing/supplier-home.css";
import "@/features/landing/supplier-home-refinement.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Website.meta" });
  return {
    ...pageMetadata({
      title: t("homeTitle"),
      description: t("homeDescription"),
      path: "/",
      locale,
    }),
    title: { absolute: t("homeTitle") },
  };
}

export default async function SupplierHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const language = locale === "ar" ? "ar" : "en";
  return (
    <div className="supplier-home">
      {/* Trusted, checked-in markup generated from the selected EN/AR preview. */}
      <div dangerouslySetInnerHTML={{ __html: markup[language] }} />
      <SupplierHomeRuntime locale={language} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${siteOrigin()}/#organization`,
          name: company.name,
          url: siteOrigin(),
          logo: new URL(brand.logo, siteOrigin()).toString(),
          email: company.email,
          telephone: "+97143364633",
          address: {
            "@type": "PostalAddress",
            streetAddress: company.address,
            addressLocality: "Dubai",
            addressCountry: "AE",
            postOfficeBoxNumber: company.poBox,
          },
        }}
      />
    </div>
  );
}
