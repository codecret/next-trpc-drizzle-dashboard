import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import "./home-hero.css";

export function Hero() {
  const t = useTranslations("Website.editorial");
  return (
    <section
      className="editorial-hero site-container"
      aria-labelledby="hero-title"
    >
      <div className="editorial-hero-topline">
        <span>{t("heroCompanyLabel")}</span>
        <span>{t("heroLocationLabel")}</span>
      </div>
      <div className="editorial-hero-layout">
        <div className="editorial-hero-copy">
          <h1 id="hero-title">
            <span>{t("heroOne")}</span>
            <span>{t("heroTwo")}</span>
            <span>{t("heroThree")}</span>
          </h1>
          <p>{t("heroIntro")}</p>
          <div className="editorial-hero-actions">
            <Link href="/products" className="editorial-button">
              {t("catalogue")}
              <ArrowUpRight aria-hidden="true" />
            </Link>
            <Link href="/contact" className="editorial-link">
              {t("enquiry")}
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="editorial-hero-stage">
          <Link
            href="/products/alkaline-batteries"
            className="hero-battery-plate"
            aria-label={t("heroPlateLink")}
          >
            <div className="hero-plate-label">
              <span>TOSHIBA</span>
              <span>{t("heroPowerLabel")}</span>
            </div>
            <Image
              src="/images/catalogue/b71b371bf6-220620200923552b.jpg"
              alt={t("heroBatteryImageAlt")}
              fill
              priority
              sizes="(max-width: 767px) 72vw, 42vw"
            />
            <span className="hero-plate-footer">
              <span>{t("heroPlate")}</span>
              <ArrowUpRight aria-hidden="true" />
            </span>
          </Link>
          <Link
            href="/products/led-lighting"
            className="hero-lighting-plate"
            aria-label={t("heroLightingLink")}
          >
            <span className="hero-lighting-index">
              {t("heroLightingLabel")}
            </span>
            <Image
              src="/images/catalogue/8b5032f0f2-07112024063132abulbprod1.png"
              alt={t("lightingImageAlt")}
              width={300}
              height={300}
              sizes="(max-width: 767px) 110px, 150px"
              priority
            />
            <span>
              {t("heroLighting")}
              <ArrowUpRight aria-hidden="true" />
            </span>
          </Link>
          <span className="hero-studio-caption" aria-hidden="true">
            {t("heroStudioCaption")}
          </span>
        </div>
      </div>
      <a href="#toshiba-products" className="editorial-hero-scroll">
        <ArrowDown aria-hidden="true" />
        <span>{t("rangesTitle")}</span>
        <span>01—05</span>
      </a>
    </section>
  );
}
