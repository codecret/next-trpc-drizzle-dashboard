import Image from "next/image";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  brand,
  childrenOf,
  company,
  localize,
} from "@/features/catalogue/catalogue";
import { MotionPreference } from "./motion-preference";
import "./industrial-footer.css";

export function Footer() {
  const t = useTranslations("Website");
  const locale = useLocale();
  const copy =
    locale === "ar"
      ? {
          enquiry: "للاستفسارات التجارية",
          lineOne: "أخبرنا بما",
          lineTwo: "تحتاجه.",
          description:
            "تواصل مع فريقنا في دبي بشأن المنتجات أو متطلبات التوريد أو فرص التوزيع.",
          imprint: "تجارة عامة",
          location: "دبي، الإمارات العربية المتحدة",
          since: "منذ 2013",
          home: "العودة إلى الرئيسية",
        }
      : {
          enquiry: "Business enquiries",
          lineOne: "Tell us what",
          lineTwo: "you need.",
          description:
            "Talk to our Dubai team about products, supply requirements or distribution.",
          imprint: "General trading",
          location: "Dubai, United Arab Emirates",
          since: "Since 2013",
          home: "Back to home",
        };

  return (
    <footer className="industrial-footer">
      <div className="site-container">
        <div className="industrial-footer-opening">
          <div className="industrial-footer-statement">
            <p className="industrial-footer-kicker">{copy.enquiry}</p>
            <h2>
              {copy.lineOne}
              <br />
              <span>{copy.lineTwo}</span>
            </h2>
          </div>
          <div className="industrial-footer-enquiry">
            <p>{copy.description}</p>
            <Link href="/contact" className="industrial-footer-cta">
              {t("nav.enquire")}
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="industrial-footer-directory">
          <div className="industrial-footer-brand">
            <Link
              href="/"
              className="industrial-footer-logo"
              aria-label={`${company.name} — ${copy.home}`}
            >
              <Image
                src={brand.logo}
                alt={company.name}
                width={210}
                height={62}
                sizes="170px"
              />
            </Link>
            <p className="industrial-footer-description">
              {t("footer.description")}
            </p>
          </div>
          <div className="industrial-footer-column">
            <h3>{t("footer.company")}</h3>
            <ul>
              {["about", "services", "support", "contact"].map((page) => (
                <li key={page}>
                  <Link href={`/${page}`}>{t(`nav.${page}`)}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="industrial-footer-column">
            <h3>{t("footer.ranges")}</h3>
            <ul>
              {childrenOf().map((category) => (
                <li key={category.slug}>
                  <Link href={`/products/${category.slug}`}>
                    {localize(category.name, locale)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/#tekbatt">Tekbatt</Link>
              </li>
              <li>
                <Link href="/products">{t("nav.allProducts")}</Link>
              </li>
            </ul>
          </div>
          <div className="industrial-footer-contact">
            <h3>{t("footer.contact")}</h3>
            <address>
              <a href={`mailto:${company.email}`}>
                <Mail aria-hidden="true" />
                <bdi dir="ltr">{company.email}</bdi>
              </a>
              <a href={`tel:${company.phone.replace(/\s/g, "")}`}>
                <Phone aria-hidden="true" />
                <bdi dir="ltr">{company.phone}</bdi>
              </a>
              <p>
                <MapPin aria-hidden="true" />
                <span>
                  {t("visualDetails.officeAddress")}
                  <br />
                  {t("footer.location")}
                  <br />
                  {t("contact.poBox", { box: company.poBox })}
                </span>
              </p>
            </address>
          </div>
        </div>

        <div className="industrial-footer-imprint">
          <span
            className="industrial-footer-wordmark"
            dir="ltr"
            aria-hidden="true"
          >
            SFGT<span>.</span>
          </span>
          <div className="industrial-footer-origin">
            <span
              className="industrial-footer-origin-mark"
              aria-hidden="true"
            />
            <p>{copy.imprint}</p>
            <p>{copy.location}</p>
            <span>{copy.since}</span>
          </div>
        </div>

        <div className="industrial-footer-bottom">
          <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
          <div className="industrial-footer-preferences">
            <Link href="/support">
              {t("footer.support")}
              <ArrowUpRight aria-hidden="true" />
            </Link>
            <MotionPreference />
          </div>
        </div>
      </div>
    </footer>
  );
}
