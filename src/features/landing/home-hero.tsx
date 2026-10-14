import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { childrenOf, localize, products } from "@/features/catalogue/catalogue";
import "./home-hero.css";

export function Hero() {
  const t = useTranslations("Website.businessHome");
  const locale = useLocale();
  const divisions = childrenOf();
  const lightingImage = products.find((product) => product.id === "led-1")
    ?.images[0];

  return (
    <section className="business-hero" aria-labelledby="hero-title">
      <div className="site-container business-hero-grid">
        <div className="business-hero-copy">
          <h1 id="hero-title">
            <span>{t("heroLineOne")}</span>
            <span>{t("heroLineTwo")}</span>
            <span className="business-hero-accent">{t("heroLineThree")}</span>
          </h1>
          <p className="business-hero-description">{t("heroDescription")}</p>
          <div className="business-hero-actions">
            <Link
              href="/products"
              className="business-button business-button-primary"
            >
              {t("browseProducts")}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a
              href="#homepage-enquiry"
              className="business-button business-button-secondary"
            >
              {t("talkToTeam")}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
        <nav
          className="business-range-panel"
          aria-labelledby="business-ranges-title"
        >
          <div className="business-range-heading">
            <h2 className="business-eyebrow" id="business-ranges-title">
              {t("rangeTitle")}
            </h2>
            <span>{t("divisionCount", { count: divisions.length })}</span>
          </div>
          {divisions.map((category) => (
            <Link
              key={category.slug}
              href={"/products/" + category.slug}
              className="business-range"
            >
              <div className="business-range-image">
                <Image
                  src={
                    category.slug === "led-lighting" && lightingImage
                      ? lightingImage
                      : category.image
                  }
                  alt=""
                  fill
                  sizes="(max-width: 767px) 70px, 82px"
                />
              </div>
              <span className="business-range-copy">
                <strong>{localize(category.name, locale)}</strong>
                <span>{t(`ranges.${category.slug}`)}</span>
                <small>{t("viewRange")}</small>
              </span>
              <ArrowUpRight aria-hidden="true" />
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
