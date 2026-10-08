import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  Battery,
  BatteryCharging,
  BatteryFull,
  ChevronDown,
  CircleHelp,
  PackageSearch,
  Recycle,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react";
import { JsonLd } from "@/features/catalogue/components/json-ld";
import "./services-faq.css";

const questionIcons = {
  where: Truck,
  care: ShieldCheck,
  choose: PackageSearch,
  life: BatteryFull,
  output: Battery,
  recharge: BatteryCharging,
  categories: Recycle,
  operation: Zap,
};

export function Faq({ full = false }: { full?: boolean }) {
  const t = useTranslations("Website");
  const keys = full
    ? [
        "where",
        "care",
        "choose",
        "life",
        "output",
        "recharge",
        "categories",
        "operation",
      ]
    : ["where", "choose", "recharge", "life"];
  const faqs = keys.map((key) => ({
    key,
    question: t("faq." + key + ".q"),
    answer: t("faq." + key + ".a"),
  }));

  return (
    <section
      className={
        "faq-section " + (full ? "faq-section-full" : "faq-section-home")
      }
      aria-labelledby="faq-heading"
    >
      <div className="site-container faq-layout">
        <div className="faq-intro">
          <p className="service-eyebrow">FAQ</p>
          <h2 id="faq-heading">{t("support.faqTitle")}</h2>
          <p className="faq-description">{t("support.faqIntro")}</p>
          {!full && (
            <Link href="/support" className="service-section-link">
              {t("footer.support")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          )}
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => {
            const Icon =
              questionIcons[faq.key as keyof typeof questionIcons] ||
              CircleHelp;
            return (
              <details
                key={faq.question}
                className="faq-item"
                open={index === 0}
              >
                <summary>
                  <Icon className="faq-question-icon" aria-hidden="true" />
                  <span className="faq-question">{faq.question}</span>
                  <ChevronDown className="faq-chevron" aria-hidden="true" />
                </summary>
                <p>{faq.answer}</p>
              </details>
            );
          })}
        </div>
        {full && (
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            }}
          />
        )}
      </div>
    </section>
  );
}
