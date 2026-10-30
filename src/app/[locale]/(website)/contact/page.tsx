import { getTranslations } from "next-intl/server";
import {
  ArrowUpRight,
  Clock,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import { PageHeading } from "@/features/catalogue/components/page-heading";
import { EnquiryForm } from "@/features/contact/components/enquiry-form";
import { getEnquiryDeliveryEnabled } from "@/features/contact/server/enquiry-delivery";
import { company } from "@/features/catalogue/catalogue";
import { pageMetadata } from "@/features/catalogue/metadata";
import "@/features/contact/components/contact-page.css";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    product?: string | string[];
    code?: string | string[];
  }>;
};
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Website.contact" });
  return pageMetadata({
    title: t("title"),
    description: t("intro"),
    path: "/contact",
    locale,
  });
}
export default async function ContactPage({ searchParams }: Props) {
  const t = await getTranslations("Website.contact");
  const ui = await getTranslations("Website.inner");
  const query = await searchParams;
  const product = (
    typeof query.product === "string" ? query.product : ""
  ).slice(0, 180);
  const code = (typeof query.code === "string" ? query.code : "").slice(0, 60);
  return (
    <div className="site-container contact-page">
      <PageHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("intro")}
      />
      <nav className="contact-quick-actions" aria-label={t("general")}>
        <a href={`mailto:${company.email}`}>
          <Mail aria-hidden="true" />
          <span>
            <small>{ui("emailTeam")}</small>
            <strong>
              <bdi dir="ltr">{company.email}</bdi>
            </strong>
          </span>
          <ArrowUpRight aria-hidden="true" />
        </a>
        <a href="tel:+97143364633">
          <Phone aria-hidden="true" />
          <span>
            <small>{ui("callTeam")}</small>
            <strong>
              <bdi dir="ltr" className="whitespace-nowrap">
                {company.phone}
              </bdi>
            </strong>
          </span>
          <ArrowUpRight aria-hidden="true" />
        </a>
        <a
          href="https://wa.me/971503420157"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle aria-hidden="true" />
          <span>
            <small>{t("whatsapp")}</small>
            <strong>
              <bdi dir="ltr" className="whitespace-nowrap">
                {company.whatsapp}
              </bdi>
            </strong>
          </span>
          <ArrowUpRight aria-hidden="true" />
        </a>
      </nav>
      <div className="contact-layout">
        <EnquiryForm
          key={`${product}-${code}`}
          product={`${product}${code ? ` (${code})` : ""}`}
          email={company.email}
          deliveryEnabled={getEnquiryDeliveryEnabled()}
        />
        <div className="contact-details">
          <section className="contact-office">
            <MapPin
              className="mb-4 size-5 text-muted-foreground"
              aria-hidden="true"
            />
            <h2 className="font-semibold">{t("office")}</h2>
            <address className="mt-3 text-sm not-italic leading-7 text-muted-foreground">
              <span lang="en">
                {company.address}
                <br />
                {company.city}
              </span>
              <br />
              {t("poBox", { box: company.poBox })}
            </address>
          </section>
          <section className="contact-phone">
            <Phone
              className="mb-4 size-5 text-muted-foreground"
              aria-hidden="true"
            />
            <h2 className="font-semibold">{t("general")}</h2>
            <dl className="contact-phone-list">
              <div>
                <dt className="text-xs text-muted-foreground">{t("phone")}</dt>
                <dd>
                  <a
                    href="tel:+97143364633"
                    className="inline-block py-1 hover:underline"
                  >
                    {company.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">{t("mobile")}</dt>
                <dd>
                  <a
                    href="tel:+971565006024"
                    className="inline-block py-1 hover:underline"
                  >
                    {company.mobile}
                  </a>
                </dd>
              </div>
            </dl>
          </section>
          <section className="contact-toshiba">
            <Mail
              className="mb-4 size-5 text-muted-foreground"
              aria-hidden="true"
            />
            <h2 className="font-semibold">{t("toshiba")}</h2>
            <div className="mt-3 space-y-3 text-sm text-muted-foreground">
              <p>
                <a
                  href={`mailto:${company.toshibaEmail}`}
                  className="hover:underline"
                >
                  {company.toshibaEmail}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${company.toshibaAlternativeEmail}`}
                  className="hover:underline"
                >
                  {company.toshibaAlternativeEmail}
                </a>
              </p>
            </div>
          </section>
          <section className="contact-hours">
            <Clock
              className="mb-4 size-5 text-muted-foreground"
              aria-hidden="true"
            />
            <h2 className="font-semibold">{t("hours")}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {t("weekdays")}
              <br />
              {t("sunday")}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {t("timezone")}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
