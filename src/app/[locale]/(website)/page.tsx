import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Hero } from "@/features/landing/home-hero";
import { Faq } from "@/features/landing/battery-faq";
import {
  categoryBySlug,
  company,
  localize,
  products,
  productsIn,
} from "@/features/catalogue/catalogue";
import { pageMetadata } from "@/features/catalogue/metadata";
import { EnquiryForm } from "@/features/contact/components/enquiry-form";
import { getEnquiryDeliveryEnabled } from "@/features/contact/server/enquiry-delivery";
import "@/features/landing/home-page.css";

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props) {
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
export default async function Home({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("Website.editorial");
  const process = await getTranslations("Website.businessHome");
  const commodityGroups = [
    {
      title: "food",
      slugs: [
        "sugar",
        "edible-oils",
        "seeds",
        "meat-and-fish",
        "other-food-products",
      ],
    },
    {
      title: "commercial",
      slugs: ["chemicals", "construction-materials", "hospitality"],
    },
  ];
  return (
    <div className="editorial-home">
      <Hero />
      <div className="site-container">
        <dl className="editorial-facts">
          <div>
            <dt>2013</dt>
            <dd>{t("since")}</dd>
          </div>
          <div>
            <dt>{products.length}</dt>
            <dd>{t("catalogueCount")}</dd>
          </div>
          <div>
            <dt>
              <MapPin aria-hidden="true" /> Dubai
            </dt>
            <dd>{t("location")}</dd>
          </div>
        </dl>
      </div>
      <section
        id="toshiba-products"
        className="site-container editorial-ranges"
        aria-labelledby="ranges-heading"
      >
        <div className="editorial-section-heading" data-reveal>
          <div>
            <p className="editorial-label">{t("rangesLabel")}</p>
            <h2 id="ranges-heading">{t("rangesTitle")}</h2>
          </div>
          <p>{t("rangesIntro")}</p>
        </div>
        <div className="editorial-range-grid">
          <Link
            href="/products/batteries"
            className="editorial-battery-range"
            data-reveal
          >
            <div className="range-top">
              <span>TOSHIBA</span>
              <span>01 / 03</span>
            </div>
            <h3>{t("batteries")}</h3>
            <p>{t("batteryIntro")}</p>
            <div className="range-battery-image">
              <Image
                src="/images/catalogue/f6f50ad7ec-30092020075551LR6GCP-BP10MS4FCN.jpg"
                alt={t("batteryImageAlt")}
                fill
                sizes="(max-width:767px) 85vw, 43vw"
              />
            </div>
            <div className="range-bottom">
              <span>
                {t("productsCount", { count: productsIn("batteries").length })}
              </span>
              <span>
                {t("viewRange")}
                <ArrowUpRight aria-hidden="true" />
              </span>
            </div>
          </Link>
          <Link
            href="/products/led-lighting"
            className="editorial-lighting-range"
            data-reveal
          >
            <div className="range-top">
              <span>TOSHIBA</span>
              <span>02 / 03</span>
            </div>
            <div className="range-lighting-image">
              <Image
                src="/images/catalogue/8b5032f0f2-07112024063132abulbprod1.png"
                alt={t("lightingImageAlt")}
                fill
                sizes="(max-width:767px) 65vw, 26vw"
              />
            </div>
            <h3>{t("lighting")}</h3>
            <p>{t("lightingIntro")}</p>
            <div className="range-bottom">
              <span>
                {t("productsCount", {
                  count: productsIn("led-lighting").length,
                })}
              </span>
              <span>
                {t("viewRange")}
                <ArrowUpRight aria-hidden="true" />
              </span>
            </div>
          </Link>
        </div>
      </section>
      <section
        id="tekbatt"
        className="site-container editorial-tekbatt"
        aria-labelledby="tekbatt-heading"
        data-reveal
      >
        <div className="tekbatt-study">
          <Image
            src="/images/editorial/alkaline-ultra-studio.webp"
            alt={t("tekbattImageAlt")}
            fill
            sizes="(max-width:767px) 85vw, 30vw"
          />
        </div>
        <div className="tekbatt-copy">
          <p className="editorial-label">{t("partnerLabel")}</p>
          <h2 id="tekbatt-heading">{t("tekbattTitle")}</h2>
          <p>{t("tekbattIntro")}</p>
          <div className="tekbatt-ranges">
            {[
              { key: "ultra", slug: "alkaline-ultra" },
              { key: "power", slug: "alkaline-power" },
              { key: "rechargeable", slug: "rechargeable-value-energy" },
            ].map((range) => (
              <a
                key={range.key}
                href={`https://tekbatt.com/product-category/${range.slug}/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span lang="en" dir="ltr">
                  {t(range.key)}
                </span>
                <ArrowUpRight aria-hidden="true" />
                <span className="sr-only">{t("tekbattNote")}</span>
              </a>
            ))}
          </div>
        </div>
        <a
          className="tekbatt-main-link"
          href="https://tekbatt.com/shop/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>{t("tekbattLink")}</span>
          <ArrowUpRight aria-hidden="true" />
          <small>{t("tekbattNote")}</small>
        </a>
      </section>
      <section
        id="commodities"
        className="editorial-commodities"
        aria-labelledby="commodities-heading"
      >
        <div className="site-container">
          <div className="editorial-section-heading" data-reveal>
            <div>
              <p className="editorial-label">{t("commoditiesLabel")}</p>
              <h2 id="commodities-heading">{t("commoditiesTitle")}</h2>
            </div>
            <p>{t("commoditiesIntro")}</p>
          </div>
          <div className="commodities-layout">
            <figure data-reveal>
              <div className="commodities-photo">
                <Image
                  src="/images/catalogue/0edf92e498-seedsimg1.jpg"
                  alt={t("commodityImageAlt")}
                  fill
                  sizes="(max-width:767px) 85vw, 43vw"
                />
              </div>
              <figcaption>
                <span>03 / 03</span>
                {t("commodityCaption")}
              </figcaption>
            </figure>
            <div className="commodities-directory" data-reveal>
              {commodityGroups.map((group) => (
                <div key={group.title}>
                  <h3>{t(group.title)}</h3>
                  <ul>
                    {group.slugs.map((slug) => {
                      const category = categoryBySlug.get(slug)!;
                      return (
                        <li key={slug}>
                          <Link href={`/products/${slug}`}>
                            <span>{localize(category.name, locale)}</span>
                            <ArrowUpRight aria-hidden="true" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
              <Link href="/products/commodities" className="editorial-link">
                {t("commodityLink")}
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section
        id="company-profile"
        className="site-container editorial-company"
        aria-labelledby="company-heading"
      >
        <div className="editorial-company-copy" data-reveal>
          <p className="editorial-label">{t("companyLabel")}</p>
          <h2 id="company-heading">{t("companyTitle")}</h2>
          <p>{t("companyIntro")}</p>
          <Link href="/about" className="editorial-link">
            {t("companyLink")}
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
        <div className="editorial-company-record" data-reveal>
          <div className="company-year">
            <span>2013</span>
            <small>{t("since")}</small>
          </div>
          <Image
            src="/images/editorial/dubai-sketch.svg"
            width={680}
            height={240}
            alt={t("companyVisualAlt")}
            className="company-skyline"
          />
          <div className="company-record-line">
            <MapPin aria-hidden="true" />
            <span>{t("companyAddress")}</span>
          </div>
          <dl>
            <dt>{t("companyMarkets")}</dt>
            <dd>{t("companyMarketsList")}</dd>
          </dl>
        </div>
      </section>
      <section className="editorial-process" aria-labelledby="process-heading">
        <div className="site-container">
          <div className="editorial-section-heading" data-reveal>
            <div>
              <p className="editorial-label">{t("processLabel")}</p>
              <h2 id="process-heading">{t("processTitle")}</h2>
            </div>
            <p>{t("processIntro")}</p>
          </div>
          <ol>
            {["requirements", "quotation", "coordination", "support"].map(
              (key, index) => (
                <li key={key} data-reveal>
                  <span>0{index + 1}</span>
                  <h3>{process(`steps.${key}.title`)}</h3>
                  <p>{process(`steps.${key}.description`)}</p>
                </li>
              )
            )}
          </ol>
          <Link href="/services" className="editorial-link">
            {t("services")}
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>
      <Faq />
      <section
        id="homepage-enquiry"
        className="site-container editorial-enquiry"
        aria-labelledby="enquiry-heading"
      >
        <div className="editorial-enquiry-copy" data-reveal>
          <p className="editorial-label">{t("quoteLabel")}</p>
          <h2 id="enquiry-heading">{t("quoteTitle")}</h2>
          <p>{t("quoteIntro")}</p>
          <div>
            <span>{t("quoteDirect")}</span>
            <a href={`mailto:${company.email}`} dir="ltr">
              {company.email}
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="editorial-enquiry-form" data-reveal>
          <EnquiryForm
            compact
            email={company.email}
            deliveryEnabled={getEnquiryDeliveryEnabled()}
          />
        </div>
      </section>
    </div>
  );
}
