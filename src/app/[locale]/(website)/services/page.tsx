import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight, ArrowUpRight, FileText } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/features/catalogue/components/breadcrumbs";
import { pageMetadata } from "@/features/catalogue/metadata";
import "@/features/landing/editorial-inner.css";

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
  const visual = await getTranslations("Website.visualDetails");
  const locale = await getLocale();
  const copy =
    locale === "ar"
      ? {
          title: "من التوريد\nإلى التوزيع.",
          details: "ابدأ بمتطلباتك",
          scope: "خدماتنا",
          partnership: "شراكات التوزيع",
          number: "الخدمة",
        }
      : {
          title: "From sourcing\nto distribution.",
          details: "Start with your requirements",
          scope: "What we do",
          partnership: "Distribution partnerships",
          number: "Service",
        };
  const services = [
    {
      key: "sourcing",
      href: "/products/commodities",
      cta: site("reference.viewProducts"),
    },
    { key: "distribution", href: "#distribution", cta: t("partnerCta") },
    {
      key: "logistics",
      href: { pathname: "/contact", query: { product: t("logisticsTitle") } },
      cta: site("inner.talkToTeam"),
    },
    { key: "support", href: "/support", cta: t("downloadLink") },
  ];
  return (
    <div className="editorial-inner editorial-services site-container">
      <Breadcrumbs
        locale={locale}
        items={[
          { label: site("nav.home"), href: "/" },
          { label: site("nav.services") },
        ]}
      />
      <header className="ei-hero ei-services-hero">
        <div>
          <p className="ei-kicker">{site("nav.services")}</p>
          <h1>{copy.title}</h1>
          <p className="ei-intro">{t("intro")}</p>
          <Link className="ei-button" href="/contact">
            {site("inner.talkToTeam")}
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
        <aside className="ei-requirements" aria-labelledby="requirements-title">
          <p className="ei-kicker">{visual("enquiryLabel")}</p>
          <h2 id="requirements-title">{copy.details}</h2>
          <ol>
            {["product", "quantity", "destination"].map((key, index) => (
              <li key={key}>
                <span aria-hidden="true">0{index + 1}</span>
                <div>
                  <h3>{visual(`details.${key}.title`)}</h3>
                  <p>{visual(`details.${key}.description`)}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link href="/contact" className="ei-text-link">
            {visual("enquiryCta")}
            <ArrowRight aria-hidden="true" />
          </Link>
        </aside>
      </header>
      <section
        className="ei-service-ledger"
        aria-labelledby="service-ledger-title"
        data-reveal
      >
        <div className="ei-ledger-label">
          <h2 id="service-ledger-title">{copy.scope}</h2>
          <span>{site("design.locationShort")}</span>
        </div>
        {services.map(({ key, href, cta }, index) => (
          <article key={key} className="ei-service-row">
            <span className="ei-index" aria-hidden="true">
              0{index + 1}
            </span>
            <h3>{t(`${key}Title`)}</h3>
            <div>
              <p>{t(`${key}Text`)}</p>
              <Link href={href} className="ei-text-link">
                {cta}
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </section>
      <section
        id="distribution"
        className="ei-distribution-spread"
        data-reveal
        aria-labelledby="distribution-title"
      >
        <figure>
          <Image
            src="/images/campaign/service-lifestyle-v1.png"
            alt={site("reference.serviceImageAlt")}
            width={1925}
            height={817}
            sizes="(min-width: 900px) 50vw, 90vw"
          />
          <figcaption>
            <strong>TOSHIBA</strong>
            <span>{site("reference.distribution")}</span>
          </figcaption>
        </figure>
        <div>
          <p className="ei-kicker">{copy.partnership}</p>
          <h2 id="distribution-title">{t("partnerTitle")}</h2>
          <p>{t("partnerText")}</p>
          <Link
            href={{
              pathname: "/contact",
              query: { product: "Toshiba distribution partnership" },
            }}
            className="ei-button"
          >
            {t("partnerCta")}
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </section>
      <aside className="ei-document-note">
        <FileText aria-hidden="true" />
        <p>{t("documents")}</p>
        <Link href="/support" className="ei-text-link">
          {t("downloadLink")}
          <ArrowRight aria-hidden="true" />
        </Link>
      </aside>
    </div>
  );
}
