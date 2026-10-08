import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import "./contact-banner.css";

export function ContactBanner() {
  const t = useTranslations("Website");
  return (
    <section className="contact-banner" aria-labelledby="contact-invitation">
      <Image
        src="/images/campaign/dubai-contact-v1.png"
        alt=""
        fill
        sizes="100vw"
        className="contact-banner-background"
      />
      <div className="site-container contact-banner-inner">
        <div className="contact-banner-copy">
          <p className="contact-banner-eyebrow">{t("design.nextStep")}</p>
          <h2 id="contact-invitation">
            <span>{t("design.ctaLineOne")}</span>
            <span>{t("design.ctaLineTwo")}</span>
          </h2>
        </div>
        <Link href="/contact" className="contact-banner-link">
          {t("nav.enquire")}
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
