import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Headset,
  Mail,
  MapPin,
  Phone,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { brand, company } from "@/features/catalogue/catalogue";
import { EnquiryForm } from "@/features/contact/components/enquiry-form";
import { PremiumSketch } from "./premium-sketch";
import "./premium-company.css";

type LocaleProps = { locale: string };

const officeMap =
  "https://www.google.com/maps/search/?api=1&query=Sulemane+Faruk+General+Trading+Al+Qusais+Dubai";
const officeTelephone = `tel:${company.phone.replace(/[^+\d]/g, "")}`;

export async function PremiumCompany({ locale }: LocaleProps) {
  const t = await getTranslations({
    locale,
    namespace: "Website.premiumCompany",
  });
  const facts = ["established", "base", "office", "markets"] as const;

  return (
    <section
      id="company"
      className="premium-company"
      aria-labelledby="premium-company-title"
    >
      <div className="premium-container premium-company-grid">
        <div className="premium-company-story" data-premium-reveal>
          <h2 id="premium-company-title" className="premium-section-heading">
            {t("company.title")}
          </h2>
          <p>{t("company.description", { company: company.name })}</p>
          <Link href="/about" className="premium-button">
            {t("company.action")}
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <a
            className="premium-company-location"
            href={officeMap}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("company.mapAction")}
          >
            <MapPin size={20} strokeWidth={1.7} aria-hidden="true" />
            <span>
              <strong>{t("company.locationTitle")}</strong>
              <span>{t("company.locationDescription")}</span>
            </span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
        <div className="premium-company-details">
          <dl className="premium-company-facts">
            {facts.map((key) => (
              <div key={key} data-premium-reveal>
                <dt>{t(`company.facts.${key}.label`)}</dt>
                <dd>{t(`company.facts.${key}.value`)}</dd>
              </div>
            ))}
          </dl>
          <div className="premium-company-skyline">
            <PremiumSketch name="dubai" />
          </div>
        </div>
      </div>
    </section>
  );
}

export async function PremiumServices({ locale }: LocaleProps) {
  const t = await getTranslations({
    locale,
    namespace: "Website.premiumCompany",
  });
  const services = [
    { key: "sourcing", Icon: ShoppingCart, href: "/services" },
    { key: "logistics", Icon: Truck, href: "/services" },
    { key: "support", Icon: Headset, href: "/support" },
  ] as const;

  return (
    <section
      id="capabilities"
      className="premium-services"
      aria-labelledby="premium-services-title"
    >
      <div className="premium-container premium-services-grid">
        <div className="premium-services-intro" data-premium-reveal>
          <div>
            <h2 id="premium-services-title" className="premium-section-heading">
              {t("services.title")}
            </h2>
            <p>{t("services.description")}</p>
          </div>
          <Link href="/services" className="premium-button-outline">
            {t("services.action")}
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
        {services.map(({ key, Icon, href }) => (
          <Link
            key={key}
            href={href}
            className="premium-service-card"
            data-premium-reveal
          >
            <Icon size={24} strokeWidth={1.6} aria-hidden="true" />
            <h3>{t(`services.items.${key}.title`)}</h3>
            <p>{t(`services.items.${key}.description`)}</p>
            <span>
              {t("services.cardAction")}
              <ArrowRight size={17} aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export async function PremiumProcess({ locale }: LocaleProps) {
  const t = await getTranslations({
    locale,
    namespace: "Website.premiumCompany.process",
  });
  const steps = ["requirements", "quotation", "coordination"] as const;

  return (
    <section
      id="how-we-work"
      className="premium-process premium-container"
      aria-labelledby="premium-process-title"
    >
      <h2
        id="premium-process-title"
        className="premium-section-heading"
        data-premium-reveal
      >
        {t("title")}
      </h2>
      <ol className="premium-process-steps">
        {steps.map((step) => (
          <li key={step}>
            <div className="premium-process-art">
              <PremiumSketch name={step} />
            </div>
            <div className="premium-process-copy">
              <h3>{t(`steps.${step}.title`)}</h3>
              <p>{t(`steps.${step}.description`)}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export async function PremiumQuotation({
  locale,
  deliveryEnabled,
}: LocaleProps & { deliveryEnabled: boolean }) {
  const t = await getTranslations({
    locale,
    namespace: "Website.premiumCompany",
  });

  return (
    <section
      id="quotation"
      className="premium-quotation-section"
      aria-labelledby="quote-heading"
    >
      <div className="premium-container">
        <div className="premium-quote">
          <div className="premium-quote-copy" data-premium-reveal>
            <h2 id="quote-heading" className="premium-section-heading">
              {t("quote.title")}
            </h2>
            <p>{t("quote.description")}</p>
            <address className="premium-quote-contact">
              <a href={officeTelephone}>
                <Phone size={20} strokeWidth={1.6} aria-hidden="true" />
                <span dir="ltr">{company.phone}</span>
              </a>
              <a href={`mailto:${company.email}`}>
                <Mail size={20} strokeWidth={1.6} aria-hidden="true" />
                <span dir="ltr">{company.email}</span>
              </a>
              <a href={officeMap} target="_blank" rel="noopener noreferrer">
                <MapPin size={20} strokeWidth={1.6} aria-hidden="true" />
                <span>{t("quote.location")}</span>
              </a>
            </address>
          </div>
          <div className="premium-quote-form" data-premium-reveal>
            <EnquiryForm
              email={company.email}
              compact
              supplierHome
              premiumHome
              deliveryEnabled={deliveryEnabled}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export async function PremiumFooter({ locale }: LocaleProps) {
  const t = await getTranslations({
    locale,
    namespace: "Website.premiumCompany",
  });
  const productLinks = [
    { key: "batteries", href: "/products/batteries" },
    { key: "lighting", href: "/products/led-lighting" },
    { key: "tekbatt", href: "/#tekbatt" },
    { key: "commodities", href: "/products/commodities" },
    { key: "allProducts", href: "/products" },
  ] as const;
  const companyLinks = [
    { key: "about", href: "/about" },
    { key: "services", href: "/services" },
    { key: "distribution", href: "/services#distribution" },
    { key: "support", href: "/support" },
    { key: "contact", href: "/contact" },
  ] as const;

  return (
    <footer className="premium-footer">
      <div className="premium-container">
        <div className="premium-footer-main">
          <div className="premium-footer-company">
            <Link href="/" aria-label={t("footer.home")}>
              <Image
                src={brand.logo}
                alt={company.name}
                width={190}
                height={56}
                sizes="190px"
              />
            </Link>
            <p>{t("footer.description")}</p>
          </div>
          <nav
            className="premium-footer-column"
            aria-label={t("footer.products")}
          >
            <h3>{t("footer.products")}</h3>
            {productLinks.map(({ key, href }) => (
              <Link href={href} key={key}>
                {t(`footer.links.${key}`)}
              </Link>
            ))}
          </nav>
          <nav
            className="premium-footer-column"
            aria-label={t("footer.quickLinks")}
          >
            <h3>{t("footer.quickLinks")}</h3>
            {companyLinks.map(({ key, href }) => (
              <Link href={href} key={key}>
                {t(`footer.links.${key}`)}
              </Link>
            ))}
          </nav>
          <div className="premium-footer-column premium-footer-contact">
            <h3>{t("footer.contact")}</h3>
            <a href={officeTelephone}>
              <Phone size={16} aria-hidden="true" />
              <span dir="ltr">{company.phone}</span>
            </a>
            <a href={`mailto:${company.email}`}>
              <Mail size={16} aria-hidden="true" />
              <span dir="ltr">{company.email}</span>
            </a>
            <a href={officeMap} target="_blank" rel="noopener noreferrer">
              <MapPin size={16} aria-hidden="true" />
              <span>{t("footer.address")}</span>
            </a>
          </div>
        </div>
        <div className="premium-footer-bottom">
          <p>
            {t("footer.copyright", {
              year: new Date().getFullYear(),
              company: company.name,
            })}
          </p>
          <Link href="/support">{t("footer.supportLink")}</Link>
        </div>
      </div>
    </footer>
  );
}
