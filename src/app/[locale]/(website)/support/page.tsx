import { getLocale, getTranslations } from "next-intl/server";
import { DownloadList } from "@/features/catalogue/components/download-list";
import { Breadcrumbs } from "@/features/catalogue/components/breadcrumbs";
import { downloads } from "@/features/catalogue/catalogue";
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
import "@/features/landing/editorial-inner.css";

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
  const site = await getTranslations("Website");
  const locale = await getLocale();
  const copy =
    locale === "ar"
      ? {
          title: "المعلومات\nالتي تحتاجها.",
          files: "مستندات السلع",
          pdf: "ملفات PDF الأصلية",
          browse: "تصفح المستندات",
        }
      : {
          title: "Information\nyou can use.",
          files: "Commodity documents",
          pdf: "Original PDF documents",
          browse: "Browse documents",
        };
  return (
    <div className="editorial-inner editorial-support support-page">
      <div className="site-container">
        <Breadcrumbs
          locale={locale}
          items={[
            { label: site("nav.home"), href: "/" },
            { label: site("nav.support") },
          ]}
        />
        <header className="ei-hero ei-support-hero">
          <div>
            <p className="ei-kicker">{t("eyebrow")}</p>
            <h1>{copy.title}</h1>
            <p className="ei-intro">{t("intro")}</p>
          </div>
          <a className="ei-library-index" href="#downloads">
            <span className="ei-kicker">{copy.files}</span>
            <span className="ei-library-count" aria-hidden="true">
              {String(downloads.length).padStart(2, "0")}
            </span>
            <span className="ei-library-bottom">
              <span>
                {downloads.length} {copy.pdf}
              </span>
              <ArrowRight aria-label={copy.browse} />
            </span>
          </a>
        </header>
      </div>
      <div className="site-container support-workspace" data-reveal>
        <nav className="support-shortcuts" aria-label={ui("supportNavigation")}>
          <p className="ei-kicker">{ui("supportNavigation")}</p>
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
                <p className="ei-kicker">{ui("documentLibrary")}</p>
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
