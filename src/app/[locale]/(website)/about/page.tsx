import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import {
  ArrowRight,
  Building2,
  Compass,
  Handshake,
  Headphones,
  MapPin,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/features/catalogue/components/breadcrumbs";
import { PageHeading } from "@/features/catalogue/components/page-heading";
import { ContactBanner } from "@/features/landing/contact-banner";
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
  const principles = [
    { key: "values", Icon: Handshake },
    { key: "vision", Icon: Compass },
    { key: "mission", Icon: Headphones },
  ];

  return (
    <>
      <div className="site-container company-page">
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
          <figure className="company-hero-visual">
            <Image
              src="/images/campaign/hero-dubai-v1.png"
              alt={site("reference.heroImageAlt")}
              width={1448}
              height={1086}
              priority
              sizes="(min-width: 1280px) 540px, (min-width: 900px) 44vw, 90vw"
            />
            <figcaption>
              <span>TOSHIBA</span>
              {site("reference.heroImageCaption")}
            </figcaption>
          </figure>
        </div>
        <dl className="company-facts">
          <div>
            <dt>
              <Building2 aria-hidden="true" />
              {site("design.established")}
            </dt>
            <dd>2013</dd>
          </div>
          <div>
            <dt>
              <MapPin aria-hidden="true" />
              {site("design.locationLabel")}
            </dt>
            <dd>{site("design.locationShort")}</dd>
          </div>
          <div>
            <dt>
              <Handshake aria-hidden="true" />
              {site("reference.partnerships")}
            </dt>
            <dd>{site("reference.trust")}</dd>
          </div>
        </dl>
        <div className="company-story-grid">
          <section className="company-story-copy">
            <p className="company-section-label" aria-hidden="true">
              01 / SFGT
            </p>
            <h2>{t("who")}</h2>
            <p>{t("whoText")}</p>
          </section>
          <section className="company-story-copy">
            <p className="company-section-label" aria-hidden="true">
              02 / SFGT
            </p>
            <h2>{t("what")}</h2>
            <p>{t("whatText")}</p>
            <Link href="/services" className="company-page-link">
              {site("home.servicesLink")}
              <ArrowRight aria-hidden="true" />
            </Link>
          </section>
        </div>
        <div className="company-principles">
          {principles.map(({ key, Icon }) => (
            <section key={key}>
              <Icon aria-hidden="true" />
              <h2>{t(key)}</h2>
              <p>{t(`${key}Text`)}</p>
            </section>
          ))}
        </div>
      </div>
      <ContactBanner />
    </>
  );
}
