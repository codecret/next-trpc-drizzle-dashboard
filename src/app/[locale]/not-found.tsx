import { getLocale, getTranslations } from "next-intl/server";
import Form from "next/form";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import "@/features/landing/not-found.css";
import { localizedPath } from "@/features/catalogue/metadata";

export default async function NotFound() {
  const t = await getTranslations("Website.error");
  const ui = await getTranslations("Website.inner");
  const catalogue = await getTranslations("Website.catalogue");
  const locale = await getLocale();
  return (
    <div className="public-surface error-page">
      <div className="site-container error-page-layout">
        <div>
          <p className="eyebrow">SFGT / 404</p>
          <h1>{t("title")}</h1>
          <p className="error-description">{t("description")}</p>
          <Form
            action={localizedPath("/products", locale)}
            className="error-search"
          >
            <label htmlFor="recovery-search">{catalogue("searchLabel")}</label>
            <div>
              <input
                id="recovery-search"
                type="search"
                name="q"
                maxLength={160}
                placeholder={catalogue("searchPlaceholder")}
              />
              <button type="submit">
                {catalogue("search")}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </Form>
          <div className="error-actions">
            <Button asChild className="site-button">
              <Link href="/products">
                {ui("browseProducts")}
                <ArrowRight className="ml-4 size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Link href="/" className="text-link">
              {t("home")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
        <span className="error-number" aria-hidden="true">
          404
          <span />
        </span>
      </div>
    </div>
  );
}
