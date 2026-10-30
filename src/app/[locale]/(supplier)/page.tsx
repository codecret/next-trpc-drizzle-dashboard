import { getTranslations } from "next-intl/server";
import {
  brand,
  childrenOf,
  company,
  localize,
} from "@/features/catalogue/catalogue";
import { SiteNavbar } from "@/features/landing/site-navbar";
import { JsonLd } from "@/features/catalogue/components/json-ld";
import { pageMetadata, siteOrigin } from "@/features/catalogue/metadata";
import { PremiumHome } from "@/features/landing/premium-home";
import { getEnquiryDeliveryEnabled } from "@/features/contact/server/enquiry-delivery";

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
  const groups = childrenOf().map((category) => ({
    title: localize(category.name, locale),
    href: `/products/${category.slug}`,
    children: childrenOf(category.slug).map((child) => ({
      title: localize(child.name, locale),
      href: `/products/${child.slug}`,
    })),
  }));
  return (
    <>
      <SiteNavbar logo={brand.logo} groups={groups} />
      <PremiumHome
        locale={locale}
        deliveryEnabled={getEnquiryDeliveryEnabled()}
      />
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
    </>
  );
}
