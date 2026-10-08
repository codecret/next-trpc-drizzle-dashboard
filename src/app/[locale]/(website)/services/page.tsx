import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import {
  ArrowRight,
  Boxes,
  FileText,
  Handshake,
  PackageSearch,
  Truck,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/features/catalogue/components/breadcrumbs";
import { PageHeading } from "@/features/catalogue/components/page-heading";
import { pageMetadata } from "@/features/catalogue/metadata";
import "@/features/landing/company-pages.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Website.services" });
  return pageMetadata({
    title: t("title"),
    description: t("intro"),
    path: "/services",
    locale,
  });
}

export default async function ServicesPage() {
  const t = await getTranslations("Website.services");
  const site = await getTranslations("Website");
  const locale = await getLocale();
  const services = [
    {
      key: "sourcing",
      Icon: PackageSearch,
      href: "/products/commodities",
      cta: site("reference.viewProducts"),
    },
    {
      key: "distribution",
      Icon: Boxes,
      href: "#distribution",
      cta: t("partnerCta"),
    },
    {
      key: "logistics",
      Icon: Truck,
      href: { pathname: "/contact", query: { product: t("logisticsTitle") } },
      cta: site("inner.talkToTeam"),
    },
    {
      key: "support",
      Icon: Handshake,
      href: "/support",
      cta: t("downloadLink"),
    },
  ];

  return (
    <div className="site-container company-page">
      <Breadcrumbs
        locale={locale}
        items={[
          { label: site("nav.home"), href: "/" },
          { label: site("nav.services") },
        ]}
      />
      <div className="company-hero company-services-hero">
        <div className="company-hero-copy">
          <PageHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("intro")}
          />
          <div className="company-hero-actions">
            <Button asChild className="site-button">
              <Link href="/contact">
                {site("inner.talkToTeam")}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Link href="/products" className="company-page-link">
              {site("nav.products")}
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
        <figure className="company-hero-visual company-service-visual">
          <Image
            src="/images/campaign/service-lifestyle-v1.png"
            alt={site("reference.serviceImageAlt")}
            width={1925}
            height={817}
            priority
            sizes="(min-width: 1280px) 540px, (min-width: 900px) 44vw, 90vw"
          />
          <figcaption>
            <span>TOSHIBA</span>
            {site("reference.distribution")}
          </figcaption>
        </figure>
      </div>
      <div className="company-section-heading">
        <div>
          <p className="company-section-label">{site("home.servicesLabel")}</p>
          <h2>{site("home.servicesTitle")}</h2>
        </div>
        <p>{site("home.servicesDescription")}</p>
      </div>
      <div className="company-service-list">
        {services.map(({ key, Icon, href, cta }, index) => (
          <section key={key} className="company-service-entry">
            <div className="company-service-entry-top" aria-hidden="true">
              <Icon aria-hidden="true" />
              <span className="company-service-index">0{index + 1}</span>
            </div>
            <h3>{t(`${key}Title`)}</h3>
            <p>{t(`${key}Text`)}</p>
            <Link href={href} className="company-page-link">
              {cta}
              <ArrowRight aria-hidden="true" />
            </Link>
          </section>
        ))}
      </div>
      <section id="distribution" className="company-distribution">
        <div>
          <p className="company-section-label">
            {site("reference.distribution")}
          </p>
          <h2>{t("partnerTitle")}</h2>
        </div>
        <div>
          <p>{t("partnerText")}</p>
          <Button asChild className="site-button">
            <Link
              href={{
                pathname: "/contact",
                query: { product: "Toshiba distribution partnership" },
              }}
            >
              {t("partnerCta")}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
      <div className="company-documents">
        <FileText aria-hidden="true" />
        <p>{t("documents")}</p>
        <Link href="/support" className="company-page-link">
          {t("downloadLink")}
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
