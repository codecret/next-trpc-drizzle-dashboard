import { getTranslations } from "next-intl/server";
import { ArrowRight, Building2, Globe2, UsersRound } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Hero } from "@/features/landing/home-hero";
import { Feature } from "@/features/landing/service-feature";
import { Faq } from "@/features/landing/battery-faq";
import { ContactBanner } from "@/features/landing/contact-banner";
import { ProductEditorial } from "@/features/landing/product-editorial";
import { pageMetadata } from "@/features/catalogue/metadata";
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
  const t = await getTranslations("Website");
  return (
    <>
      <Hero />
      <section className="reference-company" aria-labelledby="company-title">
        <div className="site-container reference-company-grid">
          <div className="reference-company-copy">
            <p className="reference-eyebrow">{t("home.companyLabel")}</p>
            <h2 id="company-title">
              <span>{t("design.companyLineOne")}</span>
              <span>{t("design.companyLineTwo")}</span>
            </h2>
            <p className="reference-company-description">
              {t("home.companyDescription")}
            </p>
            <Link href="/about" className="reference-text-link">
              {t("home.aboutLink")}
              <ArrowRight size={16} />
            </Link>
          </div>
          <dl className="reference-company-facts">
            <div>
              <Building2 aria-hidden="true" />
              <dt>2013</dt>
              <dd>{t("reference.yearEstablished")}</dd>
            </div>
            <div>
              <Globe2 aria-hidden="true" />
              <dt>{t("reference.serving")}</dt>
              <dd>{t("reference.markets")}</dd>
            </div>
            <div>
              <UsersRound aria-hidden="true" />
              <dt>{t("reference.partnerships")}</dt>
              <dd>{t("reference.trust")}</dd>
            </div>
          </dl>
        </div>
      </section>
      <ProductEditorial locale={locale} />
      <Feature />
      <Faq />
      <ContactBanner />
    </>
  );
}
