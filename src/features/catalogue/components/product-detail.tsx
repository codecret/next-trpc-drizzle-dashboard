import {
  ArrowRight,
  BookOpen,
  FileDown,
  Info,
  ListChecks,
  SlidersHorizontal,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { categoryBySlug, localize, productsIn } from "../catalogue";
import { absoluteUrl, siteOrigin } from "../metadata";
import type { Product } from "../types";
import { Breadcrumbs } from "./breadcrumbs";
import { ProductGallery } from "./product-gallery";
import { ProductCard } from "./product-card";
import { DownloadList } from "./download-list";
import { JsonLd } from "./json-ld";
import "./product-detail.css";

export async function ProductDetail({
  product,
  locale,
}: {
  product: Product;
  locale: string;
}) {
  const t = await getTranslations("Website");
  const category = categoryBySlug.get(product.category)!;
  const related = productsIn(product.category)
    .filter((item) => item.id !== product.id)
    .slice(0, 3);
  const led = product.division === "led-lighting";
  const firstDescription = product.description[0] ?? "";
  const summaryDescription =
    firstDescription.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim() ||
    firstDescription;
  const hasOverview =
    product.description.length > 1 || summaryDescription !== firstDescription;
  const hasDetails =
    hasOverview ||
    [
      product.tables,
      product.benefits,
      product.technical,
      product.downloads,
    ].some((items) => items.length > 0);
  const enquiryLink = {
    pathname: "/contact",
    query: {
      product: product.name,
      code: product.productCode || product.sfgtCode,
    },
  };
  const variants = led
    ? product.tables.flatMap((table) =>
        table.rows.map((row) => ({
          "@type": "Product",
          name: row[1],
          sku: row[0],
          ...(row[2] && /^\d{13}$/.test(row[2]) ? { gtin13: row[2] } : {}),
          additionalProperty: table.headers
            .slice(3)
            .map((name, index) => ({
              "@type": "PropertyValue",
              name,
              value: row[index + 3],
            }))
            .filter((property) => property.value),
        }))
      )
    : [];
  return (
    <div className="site-container product-detail">
      <Breadcrumbs
        locale={locale}
        items={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.products"), href: "/products" },
          ...product.categoryPath.map((slug) => ({
            label: localize(categoryBySlug.get(slug)!.name, locale),
            href: `/products/${slug}`,
          })),
          { label: product.name },
        ]}
      />
      <div className="product-detail-hero">
        <header className="product-detail-heading">
          <div className="product-detail-brand">
            <span>
              {product.division === "commodities" ? "SFGT" : "TOSHIBA"}
            </span>
            <Link href={`/products/${category.slug}`}>
              {localize(category.name, locale)}
            </Link>
          </div>
          <h1 lang="en" dir="ltr">
            {product.name}
          </h1>
          {product.family && (
            <p lang="en" dir="ltr" className="product-detail-family">
              {product.family}
            </p>
          )}
        </header>
        <ProductGallery
          key={product.id}
          images={product.images}
          name={product.name}
        />
        <div className="product-detail-summary">
          {(product.productCode || product.sfgtCode) && (
            <dl className="product-detail-codes">
              {product.productCode && (
                <div>
                  <dt>{t("catalogue.code")}</dt>
                  <dd>
                    <bdi dir="ltr">{product.productCode}</bdi>
                  </dd>
                </div>
              )}
              {product.sfgtCode && (
                <div>
                  <dt>{t("catalogue.sfgtCode")}</dt>
                  <dd>
                    <bdi dir="ltr">{product.sfgtCode}</bdi>
                  </dd>
                </div>
              )}
            </dl>
          )}
          <div
            className="product-detail-description"
            lang={product.description.length ? "en" : undefined}
            dir={product.description.length ? "ltr" : undefined}
          >
            {product.description.length ? (
              <p>{summaryDescription}</p>
            ) : (
              <p>
                {t("catalogue.commodityDescription", { product: product.name })}
              </p>
            )}
          </div>
          <div className="product-enquiry-panel">
            <Link href={enquiryLink} className="product-enquiry-button">
              {t("catalogue.enquire")}
              <ArrowRight aria-hidden="true" />
            </Link>
            <p>{t("catalogue.catalogueNotice")}</p>
          </div>
          {(product.tables.length > 0 || product.downloads.length > 0) && (
            <div className="product-summary-shortcuts">
              {product.tables.length > 0 && (
                <a href="#specifications-heading">
                  <SlidersHorizontal size={16} aria-hidden="true" />
                  {t("catalogue.specifications")}
                  <ArrowRight size={14} aria-hidden="true" />
                </a>
              )}
              {product.downloads.length > 0 && (
                <a href="#product-downloads">
                  <FileDown size={16} aria-hidden="true" />
                  {t("catalogue.downloads")}
                  <ArrowRight size={14} aria-hidden="true" />
                </a>
              )}
            </div>
          )}
          {locale === "ar" && (
            <p className="product-language-note">
              {t("catalogue.detailsLanguage")}
            </p>
          )}
          {product.notes.length > 0 && (
            <aside className="product-verification-note">
              <h2>
                <Info aria-hidden="true" />
                {t("catalogue.verification")}
              </h2>
              <ul lang="en" dir="ltr">
                {product.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </div>
      <div
        className={
          "product-information-layout" +
          (hasDetails ? "" : " product-information-layout-simple")
        }
      >
        {hasDetails && (
          <nav
            className="product-detail-navigation"
            aria-label={t("design.details")}
          >
            <span>{t("design.allDetails")}</span>
            {hasOverview && (
              <a href="#product-overview">{t("catalogue.overview")}</a>
            )}
            {product.tables.length > 0 && (
              <a href="#specifications-heading">
                {t("catalogue.specifications")}
              </a>
            )}
            {product.benefits.length > 0 && (
              <a href="#product-benefits">{t("catalogue.benefits")}</a>
            )}
            {product.technical.length > 0 && (
              <a href="#product-technical">{t("catalogue.technical")}</a>
            )}
            {product.downloads.length > 0 && (
              <a href="#product-downloads">{t("catalogue.downloads")}</a>
            )}
            <Link href={enquiryLink}>
              {t("nav.enquire")}
              <ArrowRight aria-hidden="true" />
            </Link>
          </nav>
        )}
        <div className="product-information">
          {hasOverview && (
            <section
              id="product-overview"
              className="product-info-section product-copy-section"
              aria-labelledby="product-overview-heading"
            >
              <div className="product-info-heading">
                <BookOpen aria-hidden="true" />
                <h2 id="product-overview-heading">{t("catalogue.overview")}</h2>
              </div>
              <div className="product-source-copy" lang="en" dir="ltr">
                {product.description.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>
          )}
          {product.tables.length > 0 && (
            <section
              className="product-info-section"
              aria-labelledby="specifications-heading"
            >
              <div className="product-info-heading">
                <SlidersHorizontal aria-hidden="true" />
                <h2 id="specifications-heading">
                  {t(led ? "catalogue.variants" : "catalogue.packaging")}
                </h2>
              </div>
              <p className="product-table-hint">{t("catalogue.tableHint")}</p>
              {product.tables.map((table, index) => (
                <div key={index} className="product-specification-block">
                  {product.tables.length > 1 && (
                    <h3 className="product-table-label">
                      {t("catalogue.sourceTable", { number: index + 1 })}
                    </h3>
                  )}
                  <div
                    className="product-table-scroll"
                    tabIndex={0}
                    role="region"
                    aria-label={t("catalogue.specifications")}
                  >
                    <table
                      className={
                        led
                          ? "product-specification-table product-specification-table-led"
                          : "product-specification-table"
                      }
                      lang="en"
                      dir="ltr"
                    >
                      <caption className="sr-only">
                        {product.name} — {t("catalogue.specifications")}
                      </caption>
                      <thead>
                        <tr>
                          {table.headers.map((header, column) => (
                            <th key={column} scope="col">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {table.rows.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {table.headers.map((_, column) =>
                              column === 0 ? (
                                <th key={column} scope="row">
                                  {row[column] || "—"}
                                </th>
                              ) : (
                                <td key={column}>{row[column] || "—"}</td>
                              )
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </section>
          )}
          {product.benefits.length > 0 && (
            <section
              id="product-benefits"
              className="product-info-section product-copy-section"
              aria-labelledby="product-benefits-heading"
            >
              <div className="product-info-heading">
                <ListChecks aria-hidden="true" />
                <h2 id="product-benefits-heading">{t("catalogue.benefits")}</h2>
              </div>
              <div lang="en" dir="ltr" className="product-source-copy">
                {product.benefits.map((line, index) => (
                  <p
                    key={index}
                    className={
                      line.length < 35 && line === line.toUpperCase()
                        ? "product-source-subheading"
                        : ""
                    }
                  >
                    {line}
                  </p>
                ))}
              </div>
            </section>
          )}
          {product.technical.length > 0 && (
            <section
              id="product-technical"
              className="product-info-section product-copy-section"
              aria-labelledby="product-technical-heading"
            >
              <div className="product-info-heading">
                <SlidersHorizontal aria-hidden="true" />
                <h2 id="product-technical-heading">
                  {t("catalogue.technical")}
                </h2>
              </div>
              <div lang="en" dir="ltr" className="product-source-copy">
                {product.technical.map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </section>
          )}
          {product.downloads.length > 0 && (
            <section
              id="product-downloads"
              className="product-info-section"
              aria-labelledby="product-downloads-heading"
            >
              <div className="product-info-heading">
                <FileDown aria-hidden="true" />
                <h2 id="product-downloads-heading">
                  {t("catalogue.downloads")}
                </h2>
              </div>
              <DownloadList ids={product.downloads} />
            </section>
          )}
          {product.division === "commodities" && (
            <p className="product-specification-request">
              {t("catalogue.noSpecifications")}
            </p>
          )}
          <details className="product-source-details">
            <summary>{t("catalogue.sourceDetails")}</summary>
            <ul>
              {product.sources.map((url, index) => (
                <li key={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4"
                  >
                    {t("catalogue.source")} {index + 1} ·{" "}
                    <bdi dir="ltr">{new URL(url).hostname}</bdi>
                  </a>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
      <section className="product-enquiry-followup">
        <div>
          <h2>{t("design.needHelp")}</h2>
          <p>{t("design.helpText")}</p>
        </div>
        <Link href={enquiryLink} className="product-enquiry-button">
          {t("catalogue.enquire")}
          <ArrowRight aria-hidden="true" />
        </Link>
      </section>
      {related.length > 0 && (
        <section className="product-related-section">
          <div className="product-related-heading">
            <h2>{t("catalogue.related")}</h2>
            <Link
              href={`/products/${category.slug}`}
              className="product-category-link"
            >
              {t("catalogue.browseCategory", {
                category: localize(category.name, locale),
              })}
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <div className="product-related-grid">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} locale={locale} />
            ))}
          </div>
        </section>
      )}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": variants.length > 1 ? "ProductGroup" : "Product",
          name: product.name,
          description:
            product.description.join(" ") ||
            `${product.name} — ${category.name.en}`,
          url: absoluteUrl(`/products/${product.slug}`, locale),
          image: product.images.map((path) =>
            new URL(path, siteOrigin()).toString()
          ),
          category: category.name.en,
          ...(product.division !== "commodities"
            ? { brand: { "@type": "Brand", name: "Toshiba" } }
            : {}),
          ...(product.productCode ? { mpn: product.productCode } : {}),
          ...(variants.length > 1
            ? { productGroupID: product.id, hasVariant: variants }
            : variants.length === 1
              ? {
                  sku: variants[0].sku,
                  gtin13: variants[0].gtin13,
                  additionalProperty: variants[0].additionalProperty,
                }
              : {}),
        }}
      />
    </div>
  );
}
