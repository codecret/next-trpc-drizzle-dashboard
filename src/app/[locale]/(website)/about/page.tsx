import { getLocale, getTranslations } from "next-intl/server";
import {
  ArrowRight,
  ArrowUpRight,
  Battery,
  Boxes,
  Lightbulb,
  MapPin,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/features/catalogue/components/breadcrumbs";
import { PageHeading } from "@/features/catalogue/components/page-heading";
import { ContactBanner } from "@/features/landing/contact-banner";
import { MarketFootprint } from "@/features/landing/market-footprint";
import { pageMetadata } from "@/features/catalogue/metadata";
import "@/features/landing/company-pages.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Website.about" });
  return pageMetadata({
    title: t("title"),
    description: t("intro"),
    path: "/about",
    locale,
  });
}

export default async function AboutPage() {
  const t = await getTranslations("Website.about");
  const site = await getTranslations("Website");
  const locale = await getLocale();
  const activities = [
    { key: "toshiba", Icon: Lightbulb, href: "/#toshiba-products" },
    { key: "tekbatt", Icon: Battery, href: "/#tekbatt" },
    { key: "commodities", Icon: Boxes, href: "/products/commodities" },
  ];

  return (
    <>
      <div className="site-container company-page company-about">
        <Breadcrumbs
          locale={locale}
          items={[
            { label: site("nav.home"), href: "/" },
            { label: site("nav.about") },
          ]}
        />
        <div className="company-hero">
          <div className="company-hero-copy">
            <PageHeading
              eyebrow={t("eyebrow")}
              title={t("title")}
              description={t("intro")}
            />
            <div className="company-hero-actions">
              <Button asChild className="site-button">
                <Link href="/products">
                  {t("portfolio")}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Link href="/contact" className="company-page-link">
                {site("inner.talkToTeam")}
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
          <aside
            className="company-record"
            aria-labelledby="company-record-title"
          >
            <p className="company-record-label">{t("profileLabel")}</p>
            <h2 id="company-record-title">
              Sulemane Faruk
              <br />
              General Trading LLC
            </h2>
            <dl>
              <div>
                <dt>{site("design.established")}</dt>
                <dd>2013</dd>
              </div>
              <div>
                <dt>{t("profileBase")}</dt>
                <dd>{site("design.locationShort")}</dd>
              </div>
              <div>
                <dt>{t("profileActivity")}</dt>
                <dd>{t("profileActivityValue")}</dd>
              </div>
            </dl>
            <div className="company-record-location">
              <MapPin size={20} aria-hidden="true" />
              <div>
                <strong>{t("profileOffice")}</strong>
                <p>{t("profileAddress")}</p>
              </div>
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Al+Qusais+Industrial+Area+1+Dubai"
              target="_blank"
              rel="noopener noreferrer"
              className="company-page-link"
            >
              {t("viewArea")}
              <ArrowUpRight aria-hidden="true" />
            </a>
          </aside>
        </div>
        <div className="company-story-grid company-story-with-footprint">
          <div className="company-story-narrative">
            <section className="company-story-copy">
              <h2>{t("who")}</h2>
              <p>{t("whoText")}</p>
            </section>
            <section className="company-story-copy">
              <h2>{t("what")}</h2>
              <p>{t("whatText")}</p>
              <Link href="/services" className="company-page-link">
                {site("home.servicesLink")}
                <ArrowRight aria-hidden="true" />
              </Link>
            </section>
          </div>
          <MarketFootprint />
        </div>
        <section
          className="company-activity-section"
          aria-labelledby="company-activity-heading"
        >
          <div className="company-activity-heading">
            <p className="company-section-label">{t("activityLabel")}</p>
            <h2 id="company-activity-heading">{t("activityTitle")}</h2>
          </div>
          <div className="company-activity-grid">
            {activities.map(({ key, Icon, href }) => (
              <Link key={key} href={href} className="company-activity">
                <Icon aria-hidden="true" />
                <h3>{t(`activities.${key}.title`)}</h3>
                <p>{t(`activities.${key}.description`)}</p>
                <span>
                  {t("viewRange")}
                  <ArrowRight aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
      <ContactBanner />
    </>
  );
}
