import {
  ArrowRight,
  ChevronRight,
  ClipboardList,
  FileText,
  MessagesSquare,
  Truck,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import "./home-supply-process.css";

const steps = [
  { key: "requirements", icon: ClipboardList },
  { key: "quotation", icon: FileText },
  { key: "coordination", icon: Truck },
  { key: "support", icon: MessagesSquare },
] as const;

export function HomeSupplyProcess() {
  const t = useTranslations("Website.businessHome");

  return (
    <section
      className="business-process business-process-visual"
      aria-labelledby="business-process-title"
    >
      <div className="site-container">
        <div className="business-section-heading">
          <div>
            <p className="business-eyebrow">{t("processLabel")}</p>
            <h2 id="business-process-title">{t("processTitle")}</h2>
          </div>
          <p>{t("processDescription")}</p>
        </div>
        <ol className="business-steps" role="list">
          {steps.map(({ key, icon: Icon }, index) => (
            <li className="business-step" key={key}>
              <div className="business-step-marker" aria-hidden="true">
                <Icon size={23} strokeWidth={1.5} />
              </div>
              {index < steps.length - 1 && (
                <ChevronRight
                  className="business-step-direction"
                  size={14}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              )}
              <div className="business-step-copy">
                <p className="business-step-number">
                  <span aria-hidden="true">0{index + 1} / </span>
                  {t(`steps.${key}.label`)}
                </p>
                <h3>{t(`steps.${key}.title`)}</h3>
                <p>{t(`steps.${key}.description`)}</p>
              </div>
            </li>
          ))}
        </ol>
        <Link
          href="/services"
          className="business-text-link business-services-link"
        >
          {t("servicesLink")}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
