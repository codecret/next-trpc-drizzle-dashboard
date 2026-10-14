import { getLocale } from "next-intl/server";
import { Navbar } from "@/features/landing/site-navbar";
import { Footer } from "@/features/landing/site-footer";
import { FloatingContact } from "@/features/landing/floating-contact";
import { EditorialMotion } from "@/features/landing/editorial-motion";
import {
  brand,
  childrenOf,
  company,
  localize,
} from "@/features/catalogue/catalogue";
import { JsonLd } from "@/features/catalogue/components/json-ld";
import { siteOrigin } from "@/features/catalogue/metadata";

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const groups = childrenOf().map((category) => ({
    title: localize(category.name, locale),
    href: `/products/${category.slug}`,
    children: childrenOf(category.slug).map((child) => ({
      title: localize(child.name, locale),
      href: `/products/${child.slug}`,
    })),
  }));
  return (
    <div className="website-shell flex min-h-screen flex-col">
      <Navbar logo={brand.logo} groups={groups} />
      <main id="main-content" className="min-w-0 flex-1">
        {children}
      </main>
      <Footer />
      <FloatingContact />
      <EditorialMotion />
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
