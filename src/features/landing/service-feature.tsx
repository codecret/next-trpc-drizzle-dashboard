import Image from "next/image";
import {
  ArrowRight,
  Headphones,
  Package,
  Truck,
  UsersRound,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import "./services-faq.css";

const services = [
  { key: "distribution", icon: Truck },
  { key: "support", icon: UsersRound },
  { key: "sourcing", icon: Package },
] as const;

const highlights = [
  { key: "productEnquiries", icon: Package },
  { key: "distribution", icon: Truck },
  { key: "customerSupport", icon: Headphones },
] as const;

export function Feature() {
  const t = useTranslations("Website");

  return (
    <section className="service-feature" aria-labelledby="services-heading">
      <div className="site-container service-layout">
        <div className="service-copy">
          <p className="service-eyebrow">{t("home.servicesLabel")}</p>
          <h2 id="services-heading">{t("home.servicesTitle")}</h2>
          <p className="service-description">{t("home.servicesDescription")}</p>

          <div className="service-accordion">
            {services.map(({ key, icon: Icon }) => (
              <details
                className="service-row"
                key={key}
                name="service-capabilities"
              >
                <summary>
                  <Icon className="service-row-icon" aria-hidden="true" />
                  <span>
                    {key === "sourcing"
                      ? t("reference.sourcingLabel")
                      : t("services." + key + "Title")}
                  </span>
                  <span className="service-toggle" aria-hidden="true" />
                </summary>
                <p>{t("services." + key + "Text")}</p>
              </details>
            ))}
          </div>

          <Link href="/services" className="service-section-link">
            {t("home.servicesLink")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="service-campaign">
          <div className="service-campaign-image">
            <Image
              src="/images/campaign/service-lifestyle-v1.png"
              alt={t("reference.serviceImageAlt")}
              width={1925}
              height={817}
              sizes="(min-width: 1280px) 590px, (min-width: 768px) 45vw, 90vw"
              className="service-lifestyle-image"
            />
            <div className="service-campaign-copy">
              <p className="service-toshiba-wordmark">TOSHIBA</p>
              <p className="service-campaign-caption">
                {t("atlas.companyCaption")}
              </p>
            </div>
          </div>
          <ul className="service-campaign-highlights">
            {highlights.map(({ key, icon: Icon }) => (
              <li key={key}>
                <Icon aria-hidden="true" />
                <span>{t("reference." + key)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
