import Image from "next/image";
import {
  ArrowRight,
  ChevronRight,
  Headphones,
  MapPin,
  Truck,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { childrenOf, localize } from "@/features/catalogue/catalogue";
import "./home-hero.css";

export function Hero() {
  const t = useTranslations("Website");
  const locale = useLocale();
  const assurances = [
    { icon: Truck, title: "supplyTitle", text: "supplyText" },
    { icon: MapPin, title: "localTitle", text: "localText" },
    { icon: Headphones, title: "supportTitle", text: "supportText" },
  ];
  return (
    <section className="reference-hero" aria-labelledby="hero-title">
      <div className="site-container reference-hero-grid">
        <div className="reference-hero-copy">
          <p className="reference-eyebrow">{t("design.eyebrow")}</p>
          <h1 id="hero-title">
            <span>{t("design.heroLineOne")}</span>
            <span>{t("design.heroLineTwo")}</span>
          </h1>
          <p className="reference-hero-description">
            {t("reference.heroDescription")}
          </p>
          <div className="reference-hero-actions">
            <Link
              href="/products"
              className="reference-button reference-button-primary"
            >
              {t("hero.browse")}
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/contact"
              className="reference-button reference-button-secondary"
            >
              {t("hero.contact")}
              <ArrowRight size={18} />
            </Link>
          </div>
          <ul className="reference-assurances">
            {assurances.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <Icon aria-hidden="true" />
                <span>
                  <strong>{t(`reference.${title}`)}</strong>
                  <small>{t(`reference.${text}`)}</small>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <Link
          href="/products"
          className="reference-hero-art"
          aria-label={t("hero.browse")}
        >
          <div className="reference-hero-photo">
            <Image
              src="/images/campaign/hero-dubai-v1.png"
              alt={t("reference.heroImageAlt")}
              fill
              priority
              sizes="(max-width: 767px) 92vw, (max-width: 1279px) 47vw, 565px"
            />
            <div className="reference-art-brand" aria-hidden="true">
              <strong>TOSHIBA</strong>
              <span>{t("reference.heroImageCaption")}</span>
            </div>
          </div>
          <div className="reference-art-caption">
            <span>{t("reference.imageFooter")}</span>
            <span>
              TOSHIBA
              <ArrowRight size={22} />
            </span>
          </div>
        </Link>
      </div>
      <nav
        className="reference-range-strip"
        aria-label={t("design.divisionLabel")}
      >
        <div className="site-container reference-range-grid">
          <a href="#product-index" className="reference-range-label">
            {t("reference.exploreRange")}
          </a>
          {childrenOf().map((category, index) => (
            <Link
              key={category.slug}
              href={"/products/" + category.slug}
              className="reference-range-link"
            >
              <span className="reference-range-number">0{index + 1}</span>
              <span>
                {localize(category.name, locale)}
                <small>
                  {t("reference.viewProducts")}
                  <ArrowRight size={12} />
                </small>
              </span>
              <ChevronRight size={18} />
            </Link>
          ))}
        </div>
      </nav>
    </section>
  );
}
