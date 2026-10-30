import Image from "next/image";
import { ArrowRight, ArrowUpRight, Search } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { categoryBySlug, localize, products } from "../catalogue";
import { localizedPath } from "../metadata";
import { Breadcrumbs } from "./breadcrumbs";
import { PageHeading } from "./page-heading";
import "./catalogue-landing.css";

export async function CatalogueLanding({ locale }: { locale: string }) {
  const t = await getTranslations("Website.catalogue");
  const nav = await getTranslations("Website.nav");
  const ranges = ["batteries", "led-lighting", "commodities"] as const;

  return (
    <div className="site-container catalogue-landing">
      <Breadcrumbs
        locale={locale}
        items={[{ label: nav("home"), href: "/" }, { label: nav("products") }]}
      />
      <div className="catalogue-landing-heading">
        <PageHeading
          eyebrow={t("eyebrow")}
          title={t("landingTitle")}
          description={t("landingIntro")}
        />
        <p className="catalogue-landing-total">
          <strong>{products.length}</strong>
          <span>{t("listedProducts")}</span>
        </p>
      </div>
      <form
        className="catalogue-landing-search"
        action={localizedPath("/products", locale)}
        method="get"
        role="search"
      >
        <label htmlFor="catalogue-landing-search">{t("searchLabel")}</label>
        <div>
          <Search size={20} aria-hidden="true" />
          <input
            id="catalogue-landing-search"
            name="q"
            type="search"
            maxLength={160}
            placeholder={t("searchPlaceholder")}
          />
          <input type="hidden" name="view" value="all" />
          <button type="submit">
            {t("search")}
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
      </form>
      <section
        className="catalogue-range-section"
        aria-labelledby="catalogue-range-heading"
      >
        <div className="catalogue-range-heading">
          <h2 id="catalogue-range-heading">{t("chooseRange")}</h2>
          <Link href="/products?view=all#catalogue-results">
            {t("browseAll")}
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <div className="catalogue-range-grid">
          {ranges.map((slug, index) => {
            const category = categoryBySlug.get(slug)!;
            const image =
              slug === "led-lighting"
                ? "/images/catalogue/8b5032f0f2-07112024063132abulbprod1.png"
                : slug === "commodities"
                  ? "/images/supplier-home/generated/sugar-v1.webp"
                  : category.image;
            return (
              <Link
                href={`/products/${slug}`}
                className={`catalogue-range-card catalogue-range-${slug}`}
                key={slug}
              >
                <div className="catalogue-range-image">
                  <Image
                    src={image}
                    alt=""
                    width={600}
                    height={420}
                    sizes="(max-width: 639px) 90vw, (max-width: 999px) 44vw, 30vw"
                    priority={index === 0}
                  />
                  <span>{slug === "commodities" ? "SFGT" : "TOSHIBA"}</span>
                </div>
                <div className="catalogue-range-copy">
                  <h3>{localize(category.name, locale)}</h3>
                  <p>{t(`rangeDescriptions.${slug}`)}</p>
                  <div className="catalogue-range-meta">
                    <span>
                      {t("productCount", { count: category.productCount })}
                    </span>
                    <span>
                      {t("browseRange")}
                      <ArrowRight size={18} aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <aside className="catalogue-tekbatt-route">
        <div>
          <p>TEKBATT</p>
          <h2>{t("tekbattTitle")}</h2>
        </div>
        <p>{t("tekbattIntro")}</p>
        <Link href="/#tekbatt">
          {t("tekbattAction")}
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </aside>
      <aside className="catalogue-buying-note">
        <div>
          <h2>{t("quoteTitle")}</h2>
          <p>{t("quoteIntro")}</p>
        </div>
        <Link href="/contact">
          {t("requestQuote")}
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </aside>
    </div>
  );
}
