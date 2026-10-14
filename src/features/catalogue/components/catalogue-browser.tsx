import { ArrowLeft, ArrowRight, Lightbulb, Search, X } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  ancestorsOf,
  categoryBySlug,
  childrenOf,
  localize,
  products,
} from "../catalogue";
import { localizedPath } from "../metadata";
import type { Category } from "../types";
import { ProductCard } from "./product-card";
import { Breadcrumbs } from "./breadcrumbs";
import { BatteryRangeNavigation, BatterySearch } from "./battery-controls";
import "./battery-catalogue.css";
import "./catalogue-browser.css";
import { CatalogueMasthead } from "./catalogue-masthead";
import "./catalogue-design.css";

export type CatalogueQuery = {
  q?: string;
  category?: string;
  family?: string;
  sort?: string;
  page?: string;
};

export async function CatalogueBrowser({
  category,
  query,
  locale,
  intro,
}: {
  category?: Category;
  query: CatalogueQuery;
  locale: string;
  intro?: { layout: "compact"; description: string };
}) {
  const t = await getTranslations("Website.catalogue");
  const nav = await getTranslations("Website.nav");
  const ui = await getTranslations("Website.batteries");
  const design = await getTranslations("Website.design");
  const basePath = category ? `/products/${category.slug}` : "/products";
  const search = (query.q ?? "").trim().slice(0, 160);
  const candidate = categoryBySlug.get(query.category ?? "");
  const selectedCategory =
    candidate &&
    (!category ||
      ancestorsOf(candidate).some((parent) => parent.slug === category.slug))
      ? candidate
      : undefined;
  const pool = products.filter(
    (product) => !category || product.categoryPath.includes(category.slug)
  );
  const scoped = pool.filter(
    (product) =>
      !selectedCategory || product.categoryPath.includes(selectedCategory.slug)
  );
  const families = [
    ...new Set(scoped.map((product) => product.family).filter(Boolean)),
  ];
  const family = families.includes(query.family ?? "") ? query.family! : "";
  const terms = search.toLowerCase().split(/\s+/).filter(Boolean);
  const filtered = scoped.filter(
    (product) =>
      (!family || product.family === family) &&
      terms.every((term) =>
        [
          product.name,
          product.productCode,
          product.sfgtCode,
          product.family,
          ...product.categoryPath.map((slug) =>
            localize(categoryBySlug.get(slug)!.name, locale)
          ),
          ...product.sourceCategories,
          ...product.tables.flatMap((table) => table.rows.flat()),
        ]
          .join(" ")
          .toLowerCase()
          .includes(term)
      )
  );
  if (query.sort === "name")
    filtered.sort((a, b) => a.name.localeCompare(b.name, locale));
  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const requestedPage = Number(query.page);
  const page = Number.isSafeInteger(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), totalPages)
    : 1;
  const pageProducts = filtered.slice((page - 1) * pageSize, page * pageSize);
  const childRanges = childrenOf(category?.slug ?? "");
  const parent = categoryBySlug.get(category?.parent ?? "");
  const rangeItems = childRanges.length
    ? childRanges
    : category
      ? childrenOf(category.parent)
      : childrenOf();
  const activeCategory = selectedCategory ?? category;
  const activePath = activeCategory
    ? [...ancestorsOf(activeCategory), activeCategory].map((item) => item.slug)
    : [];
  function href(overrides: Partial<CatalogueQuery> = {}) {
    const state = {
      q: search,
      category: selectedCategory?.slug,
      family,
      sort: query.sort === "name" ? "name" : "",
      ...overrides,
    };
    const params = new URLSearchParams();
    for (const key of ["q", "category", "family", "sort", "page"] as const)
      if (state[key]) params.set(key, state[key]!);
    return basePath + (params.size ? `?${params}` : "") + "#catalogue-results";
  }
  function rangeRows(
    items: Category[],
    level = 0
  ): {
    name: string;
    count: number | undefined;
    href: string;
    selected: boolean;
    level: number;
  }[] {
    return items.flatMap((item) => {
      const destination = new URLSearchParams();
      if (search) destination.set("q", search);
      if (query.sort === "name") destination.set("sort", "name");
      const canFilter =
        (!category || childRanges.length > 0) && item.productCount > 0;
      const current = activeCategory?.slug === item.slug;
      return [
        {
          name: localize(item.name, locale),
          count: item.productCount || undefined,
          href: canFilter
            ? href({ category: item.slug, family: undefined })
            : `/products/${item.slug}${destination.size ? `?${destination}` : ""}`,
          selected: current,
          level,
        },
        ...(activePath.includes(item.slug)
          ? rangeRows(childrenOf(item.slug), level + 1)
          : []),
      ];
    });
  }
  const ranges = [
    ...(!category || childRanges.length
      ? [
          {
            name: ui("allRanges"),
            count: pool.length || undefined,
            href: href({ category: undefined, family: undefined }),
            selected: !selectedCategory,
          },
        ]
      : []),
    ...rangeRows(rangeItems),
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
    ...(family ? [{ key: "family" as const, label: family }] : []),
    ...(query.sort === "name"
      ? [{ key: "sort" as const, label: t("nameAsc") }]
      : []),
  ];
  const visiblePages = Array.from(
    { length: totalPages },
    (_, i) => i + 1
  ).filter(
    (number) =>
      number === 1 || number === totalPages || Math.abs(number - page) <= 1
  );
  const enquiry = {
    pathname: "/contact",
    query: { product: category?.name.en ?? "" },
  };
  const division = category ? (ancestorsOf(category)[0] ?? category).slug : "";
  const compactIntro = !category || intro?.layout === "compact";
  const visual = compactIntro ? undefined : category?.image;
  return (
    <div className="site-container battery-page catalogue-experience catalogue-design">
      <Breadcrumbs
        locale={locale}
        items={[
          { label: nav("home"), href: "/" },
          {
            label: nav("products"),
            ...(category ? { href: "/products" } : {}),
          },
          ...(category
            ? [
                ...ancestorsOf(category).map((item) => ({
                  label: localize(item.name, locale),
                  href: `/products/${item.slug}`,
                })),
                { label: localize(category.name, locale) },
              ]
            : []),
        ]}
      />
      <CatalogueMasthead
        title={category ? localize(category.name, locale) : t("title")}
        description={
          intro?.description ??
          (category ? localize(category.description, locale) : t("description"))
        }
        brand={division && division !== "commodities" ? "TOSHIBA" : "SFGT"}
        count={pool.length}
        locale={locale}
        ranges={childRanges}
        image={
          visual
            ? {
                src: visual,
                alt: category ? localize(category.name, locale) : "",
                cover: division === "commodities",
              }
            : undefined
        }
      />
      <div className="battery-workspace">
        <aside className="battery-sidebar">
          {parent && (
            <Link
              className="catalogue-parent-link"
              href={`/products/${parent.slug}`}
            >
              <ArrowLeft size={14} aria-hidden="true" />
              {localize(parent.name, locale)}
            </Link>
          )}
          <BatteryRangeNavigation ranges={ranges} />
          <div className="battery-sidebar-help">
            <span className="battery-small-label">{ui("businessLabel")}</span>
            <h2>{design("needHelp")}</h2>
            <p>{design("helpText")}</p>
            <Link href={enquiry}>
              {ui("helpAction")}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </aside>
        <section className="battery-products" aria-label={t("filterHeading")}>
          {category && !pool.length ? (
            <div className="catalogue-range-enquiry" id="catalogue-results">
              <span className="catalogue-range-symbol">
                <Lightbulb size={30} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <p className="catalogue-section-label">
                {localize(category.name, locale)}
              </p>
              <h2>{t("rangeOnlyTitle")}</h2>
              <p>{t("rangeOnlyDescription")}</p>
              {category.ranges.length > 0 && (
                <div className="catalogue-listed-ranges">
                  <h3>{t("listedRanges")}</h3>
                  <ul>
                    {category.ranges.map((range) => (
                      <li key={range} lang="en">
                        {range}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Link href={enquiry} className="catalogue-enquiry-button">
                {t("rangeEnquiry")}
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link
                href="/products/led-lighting"
                className="catalogue-parent-link"
              >
                <ArrowLeft size={14} aria-hidden="true" />
                {t("backProducts")}
              </Link>
            </div>
          ) : (
            <>
              <BatterySearch
                action={localizedPath(basePath, locale)}
                search={search}
                category={selectedCategory?.slug}
                sort={query.sort}
                family={family}
                families={families}
                searchLabel={t("searchLabel")}
                searchPlaceholder={t("searchPlaceholder")}
                heading={
                  selectedCategory
                    ? localize(selectedCategory.name, locale)
                    : ui("allProducts")
                }
                countLabel={
                  filtered.length
                    ? t("showing", {
                        from: (page - 1) * pageSize + 1,
                        to: Math.min(page * pageSize, filtered.length),
                        count: filtered.length,
                      })
                    : t("results", { count: 0 })
                }
              />
              {!!chips.length && (
                <div className="battery-active-filters">
                  <ul>
                    {chips.map((chip) => (
                      <li key={chip.key}>
                        <Link
                          href={href({
                            [chip.key]: undefined,
                            ...(chip.key === "category"
                              ? { family: undefined }
                              : {}),
                          })}
                          aria-label={t("removeFilter", { filter: chip.label })}
                        >
                          <span>{chip.label}</span>
                          <X size={13} aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={basePath + "#catalogue-results"}
                    className="battery-clear"
                  >
                    {t("clear")}
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
                  <Search size={28} aria-hidden="true" />
                  <h3>{t("emptyTitle")}</h3>
                  <p>{t("emptyDescription")}</p>
                  <Link href={basePath + "#catalogue-results"}>
                    {t("reset")}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              )}
              {totalPages > 1 && (
                <nav
                  className="battery-pagination"
                  aria-label={t("pagination")}
                >
                  {page > 1 ? (
                    <Link
                      href={href({ page: String(page - 1) })}
                      rel="prev"
                      className="battery-page-arrow"
                      aria-label={t("previous")}
                    >
                      <ArrowLeft size={17} aria-hidden="true" />
                    </Link>
                  ) : (
                    <span className="battery-page-arrow" aria-disabled="true">
                      <ArrowLeft size={17} aria-hidden="true" />
                    </span>
                  )}
                  <ol>
                    {visiblePages.map((number, index) => (
                      <li key={number}>
                        {index > 0 && number - visiblePages[index - 1] > 1 && (
                          <span aria-hidden="true">…</span>
                        )}
                        <Link
                          href={href({ page: String(number) })}
                          aria-current={page === number ? "page" : undefined}
                          aria-label={t("page", {
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
                      href={href({ page: String(page + 1) })}
                      rel="next"
                      className="battery-page-arrow"
                      aria-label={t("next")}
                    >
                      <ArrowRight size={17} aria-hidden="true" />
                    </Link>
                  ) : (
                    <span className="battery-page-arrow" aria-disabled="true">
                      <ArrowRight size={17} aria-hidden="true" />
                    </span>
                  )}
                  <p>{t("page", { current: page, total: totalPages })}</p>
                </nav>
              )}
            </>
          )}
        </section>
      </div>
      <aside className="battery-bottom-help" data-reveal>
        <div>
          <h2>{design("needHelp")}</h2>
          <p>{design("helpText")}</p>
        </div>
        <Link href={enquiry}>
          {ui("helpAction")}
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </aside>
    </div>
  );
}
