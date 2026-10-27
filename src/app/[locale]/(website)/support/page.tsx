import { getTranslations } from "next-intl/server";
import { PageHeading } from "@/features/catalogue/components/page-heading";
import { DownloadList } from "@/features/catalogue/components/download-list";
import { Faq } from "@/features/landing/battery-faq";
import { ContactBanner } from "@/features/landing/contact-banner";
import { pageMetadata } from "@/features/catalogue/metadata";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  FileDown,
  Headphones,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import "@/features/landing/support-page.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Website.support" });
  return pageMetadata({
    title: t("title"),
    description: t("intro"),
    path: "/support",
    locale,
  });
}
export default async function SupportPage() {
  const t = await getTranslations("Website.support");
  const ui = await getTranslations("Website.inner");
  return (
    <div className="support-page">
      <div className="site-container support-introduction">
        <PageHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("intro")}
        />
      </div>
      <div className="site-container support-workspace">
        <nav className="support-shortcuts" aria-label={ui("supportNavigation")}>
          <p className="eyebrow">{ui("supportNavigation")}</p>
          <a href="#downloads">
            <FileDown aria-hidden="true" />
            <span>
              <strong>{t("downloadsTitle")}</strong>
              <small>{ui("documentsHint")}</small>
            </span>
            <ArrowRight aria-hidden="true" />
          </a>
          <a href="#faq-heading">
            <BookOpen aria-hidden="true" />
            <span>
              <strong>{ui("batteryGuidance")}</strong>
              <small>{ui("guidanceHint")}</small>
            </span>
            <ArrowRight aria-hidden="true" />
          </a>
          <Link href="/contact">
            <Headphones aria-hidden="true" />
            <span>
              <strong>{ui("talkToTeam")}</strong>
              <small>{ui("teamHint")}</small>
            </span>
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </nav>
        <div className="support-resources">
          <section
            id="downloads"
            className="support-documents"
            aria-labelledby="downloads-title"
          >
            <div className="support-documents-layout">
              <div className="support-documents-intro">
                <p className="eyebrow">{ui("documentLibrary")}</p>
                <h2 id="downloads-title">{t("downloadsTitle")}</h2>
                <p>{t("downloadsDescription")}</p>
              </div>
              <DownloadList />
            </div>
          </section>
          <Faq full />
        </div>
      </div>
      <ContactBanner />
    </div>
  );
}
