import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Hero } from "@/features/landing/home-hero";
import { HomeSupplyProcess } from "@/features/landing/home-supply-process";
import { Faq } from "@/features/landing/battery-faq";
import { ProductEditorial } from "@/features/landing/product-editorial";
import { company, products } from "@/features/catalogue/catalogue";
import { pageMetadata } from "@/features/catalogue/metadata";
import { EnquiryForm } from "@/features/contact/components/enquiry-form";
import { getEnquiryDeliveryEnabled } from "@/features/contact/server/enquiry-delivery";
import "@/features/contact/components/contact-page.css";
import "@/features/landing/home-page.css";

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
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Website.businessHome");
  const visual = await getTranslations("Website.visualDetails");
  const reference = await getTranslations("Website.reference");
  const deliveryEnabled = getEnquiryDeliveryEnabled();

  return (
    <div className="business-home">
      <Hero />
      <section className="site-container" aria-label={t("factsLabel")}>
        <dl className="business-facts">
          <div className="business-fact">
            <dt>{t("establishedTitle")}</dt>
            <dd>{t("establishedDescription")}</dd>
          </div>
          <div className="business-fact">
            <dt>{t("productsTitle", { count: products.length })}</dt>
            <dd>{t("productsDescription")}</dd>
          </div>
          <div className="business-fact">
            <dt>{t("baseTitle")}</dt>
            <dd>{t("baseDescription")}</dd>
          </div>
        </dl>
      </section>
      <section
        className="site-container business-company"
        aria-labelledby="company-title"
      >
        <figure className="business-company-visual">
          <Image
            src="/images/campaign/hero-dubai-v1.png"
            alt={reference("heroImageAlt")}
            width={1448}
            height={1086}
            sizes="(min-width: 1280px) 560px, (min-width: 768px) 46vw, 90vw"
          />
          <figcaption>
            <span>TOSHIBA</span>
            {reference("heroImageCaption")}
          </figcaption>
        </figure>
        <div className="business-company-description">
          <p className="business-eyebrow">{company.name}</p>
          <h2 id="company-title">
            <span>{t("companyLineOne")}</span>
            <span>{t("companyLineTwo")}</span>
          </h2>
          <p className="business-company-body">{t("companyDescription")}</p>
          <Link href="/about" className="business-text-link">
            {t("aboutLink")}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link href="/contact" className="business-location-note">
            <MapPin size={21} strokeWidth={1.5} aria-hidden="true" />
            <span>
              <strong>{visual("officeTitle")}</strong>
              <span>{visual("officeAddress")}</span>
            </span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
      <HomeSupplyProcess />
      <ProductEditorial locale={locale} />
      <Faq />
      <section
        id="homepage-enquiry"
        className="site-container"
        aria-labelledby="homepage-enquiry-title"
      >
        <div className="business-enquiry">
          <div className="business-enquiry-copy">
            <p className="business-eyebrow">{t("enquiryLabel")}</p>
            <h2 id="homepage-enquiry-title">{t("enquiryTitle")}</h2>
            <p className="business-enquiry-description">
              {t("enquiryDescription")}
            </p>
            <p className="business-enquiry-note">
              <strong>{t("enquiryNoteTitle")}</strong>
              {t("enquiryNoteDescription")}
            </p>
          </div>
          <div className="business-enquiry-form">
            <EnquiryForm
              compact
              email={company.email}
              deliveryEnabled={deliveryEnabled}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
