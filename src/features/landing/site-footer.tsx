import Image from "next/image";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  brand,
  childrenOf,
  company,
  localize,
} from "@/features/catalogue/catalogue";
import "./industrial-footer.css";

export function Footer() {
  const t = useTranslations("Website");
  const locale = useLocale();
  return (
    <footer className="industrial-footer">
      <div className="site-container">
        <div className="industrial-footer-directory">
          <div className="industrial-footer-brand">
            <Link href="/" className="industrial-footer-logo">
              <Image
                src={brand.logo}
                alt={company.name}
                width={210}
                height={62}
                sizes="180px"
              />
            </Link>
            <p className="industrial-footer-description">
              {t("footer.description")}
            </p>
          </div>
          <div>
            <h2>{t("footer.company")}</h2>
            <ul>
              {["about", "services", "support", "contact"].map((page) => (
                <li key={page}>
                  <Link href={`/${page}`}>{t(`nav.${page}`)}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>{t("footer.ranges")}</h2>
            <ul>
              {childrenOf().map((category) => (
                <li key={category.slug}>
                  <Link href={`/products/${category.slug}`}>
                    {localize(category.name, locale)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/#tekbatt">
                  {locale === "ar" ? "بطاريات Tekbatt" : "Tekbatt batteries"}
                </Link>
              </li>
              <li>
                <Link href="/products">
                  {locale === "ar"
                    ? "تصفّح فئات المنتجات"
                    : "View product ranges"}
                </Link>
              </li>
            </ul>
          </div>
          <div className="industrial-footer-contact">
            <h2>{t("footer.contact")}</h2>
            <address>
              <a href={`mailto:${company.email}`}>
                <Mail aria-hidden="true" />
                {company.email}
              </a>
              <a href="tel:+97143364633">
                <Phone aria-hidden="true" />
                {company.phone}
              </a>
              <a
                href={`https://wa.me/${company.whatsapp.replace(/\D/g, "")}`}
                className="industrial-footer-whatsapp"
              >
                <MessageCircle aria-hidden="true" />
                <span>{locale === "ar" ? "واتساب" : "WhatsApp"}</span>
                <bdi>{company.whatsapp}</bdi>
              </a>
              <p>
                <MapPin aria-hidden="true" />
                <span>
                  {t("footer.location")}
                  <br />
                  {t("contact.poBox", { box: company.poBox })}
                </span>
              </p>
            </address>
          </div>
        </div>
        <div className="industrial-footer-bottom">
          <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
          <div className="industrial-footer-preferences">
            <Link href="/support">
              {t("footer.support")}
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
