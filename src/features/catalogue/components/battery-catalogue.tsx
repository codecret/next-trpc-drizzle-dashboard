import Image from "next/image";
import { ArrowLeft, ArrowRight, FileText, Search, X } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { childrenOf, ancestorsOf, localize } from "../catalogue";
import { getBatteryCatalogue, batteryCatalogueHref } from "../battery-query";
import { localizedPath } from "../metadata";
import type { Category } from "../types";
import type { CatalogueQuery } from "./catalogue-browser";
import { Breadcrumbs } from "./breadcrumbs";
import { ProductCard } from "./product-card";
import { BatteryRangeNavigation, BatterySearch } from "./battery-controls";
import "./battery-catalogue.css";

export async function BatteryCatalogue({
  category,
  query,
  locale,
}: {
  category: Category;
  query: CatalogueQuery;
  locale: string;
}) {
  const t = await getTranslations("Website.batteries");
  const c = await getTranslations("Website.catalogue");
  const nav = await getTranslations("Website.nav");
  const {
    search,
    selectedCategory,
    filtered,
    pageProducts,
    page,
    totalPages,
    pageSize,
    hasFilters,
  } = getBatteryCatalogue(query, locale);
  const href = (overrides: Partial<CatalogueQuery> = {}) =>
    batteryCatalogueHref(query, overrides) + "#catalogue-results";
  const selectedBranch =
    selectedCategory?.parent === "batteries"
      ? selectedCategory.slug
      : selectedCategory &&
        ancestorsOf(selectedCategory).find(
          (item) => item.parent === "batteries"
        )?.slug;
  const ranges = [
    {
      name: t("allRanges"),
      count: category.productCount,
      href: href({ category: undefined, page: undefined }),
      selected: !selectedCategory,
    },
    ...childrenOf("batteries").map((range) => ({
      name: localize(range.name, locale),
      count: range.productCount,
      href: href({ category: range.slug, page: undefined }),
      selected: selectedBranch === range.slug,
    })),
  ];
  const chips = [
    ...(selectedCategory
      ? [
          {
            key: "category" as const,
            label: localize(selectedCategory.name, locale),
          },
        ]
      : []),
    ...(search ? [{ key: "q" as const, label: `“${search}”` }] : []),
    ...(query.sort === "name"
      ? [{ key: "sort" as const, label: c("nameAsc") }]
      : []),
  ];
  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).filter(
    (number) =>
      number === 1 || number === totalPages || Math.abs(number - page) <= 1
  );

  return (
    <div className="site-container battery-page">
      <Breadcrumbs
        locale={locale}
        items={[
          { label: nav("home"), href: "/" },
          { label: nav("products"), href: "/products" },
          { label: localize(category.name, locale) },
        ]}
      />
      <header className="battery-intro">
        <div className="battery-intro-copy">
          <p className="battery-eyebrow">
            <span>TOSHIBA</span>
            <span>{t("eyebrow")}</span>
          </p>
          <h1>{localize(category.name, locale)}</h1>
          <p className="battery-intro-description">{t("intro")}</p>
          <Link href="/support#faq-heading" className="battery-guide-link">
            <FileText size={15} aria-hidden="true" />
            {t("guide")}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <div className="battery-intro-image">
          <Image
            src="/images/campaign/batteries-lifestyle-v1.png"
            alt={t("imageAlt")}
            fill
            priority
            sizes="(max-width: 767px) 1px, (max-width: 1023px) 36vw, 380px"
          />
        </div>
      </header>

      <div className="battery-workspace">
        <aside className="battery-sidebar">
          <BatteryRangeNavigation ranges={ranges} />
          <div className="battery-sidebar-help">
            <span className="battery-small-label">{t("businessLabel")}</span>
            <h2>{t("helpTitle")}</h2>
            <p>{t("helpText")}</p>
            <Link
              href={{
                pathname: "/contact",
                query: { product: category.name.en },
              }}
            >
              {t("helpAction")}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </aside>

        <section className="battery-products" aria-label={t("productsLabel")}>
          <BatterySearch
            action={localizedPath("/products/batteries", locale)}
            search={search}
            category={selectedCategory?.slug}
            sort={query.sort}
            heading={
              selectedCategory
                ? localize(selectedCategory.name, locale)
                : t("allProducts")
            }
            countLabel={
              filtered.length
                ? c("showing", {
                    from: (page - 1) * pageSize + 1,
                    to: Math.min(page * pageSize, filtered.length),
                    count: filtered.length,
                  })
                : c("results", { count: 0 })
            }
          />
          {hasFilters && (
            <div className="battery-active-filters">
              <ul>
                {chips.map((chip) => (
                  <li key={chip.key}>
                    <Link
                      href={href({ [chip.key]: undefined, page: undefined })}
                      aria-label={c("removeFilter", { filter: chip.label })}
                    >
                      <span>{chip.label}</span>
                      <X size={13} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/products/batteries#catalogue-results"
                className="battery-clear"
              >
                {c("clear")}
              </Link>
            </div>
          )}

          {pageProducts.length ? (
            <div className="battery-product-grid">
              {pageProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                />
              ))}
            </div>
          ) : (
            <div className="battery-empty">
              <Search size={28} strokeWidth={1.5} aria-hidden="true" />
              <h3>{c("emptyTitle")}</h3>
              <p>{c("emptyDescription")}</p>
              <Link href="/products/batteries#catalogue-results">
                {t("viewAll")}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          )}

          {totalPages > 1 && (
            <nav className="battery-pagination" aria-label={c("pagination")}>
              {page > 1 ? (
                <Link
                  className="battery-page-arrow"
                  href={href({ page: String(page - 1) })}
                  rel="prev"
                  aria-label={c("previous")}
                >
                  <ArrowLeft size={17} aria-hidden="true" />
                </Link>
              ) : (
                <span className="battery-page-arrow" aria-disabled="true">
                  <ArrowLeft size={17} aria-hidden="true" />
                </span>
              )}
              <ol>
                {pages.map((number, index) => (
                  <li key={number}>
                    {index > 0 && number - pages[index - 1] > 1 && (
                      <span aria-hidden="true">…</span>
                    )}
                    <Link
                      href={href({ page: String(number) })}
                      aria-current={page === number ? "page" : undefined}
                      aria-label={c("page", {
                        current: number,
                        total: totalPages,
                      })}
                    >
                      {number}
                    </Link>
                  </li>
                ))}
              </ol>
              {page < totalPages ? (
                <Link
                  className="battery-page-arrow"
                  href={href({ page: String(page + 1) })}
                  rel="next"
                  aria-label={c("next")}
                >
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              ) : (
                <span className="battery-page-arrow" aria-disabled="true">
                  <ArrowRight size={17} aria-hidden="true" />
                </span>
              )}
              <p>{c("page", { current: page, total: totalPages })}</p>
            </nav>
          )}
        </section>
      </div>
      <aside className="battery-bottom-help">
        <div>
          <h2>{t("helpTitle")}</h2>
          <p>{t("helpText")}</p>
        </div>
        <Link
          href={{ pathname: "/contact", query: { product: category.name.en } }}
        >
          {t("helpAction")}
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </aside>
    </div>
  );
}
