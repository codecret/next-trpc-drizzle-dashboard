import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { categoryBySlug, localize } from "../catalogue";
import type { Product } from "../types";
import "./catalogue-cards.css";

export function ProductCard({
  product,
  locale,
}: {
  product: Product;
  locale: string;
}) {
  const t = useTranslations("Website.catalogue");
  const category = categoryBySlug.get(product.category)!;
  const detail =
    product.productCode ||
    product.family ||
    (product.division === "led-lighting"
      ? product.tables[0]?.rows[0]?.[1]
      : "");

  return (
    <article className="product-card">
      <Link
        href={`/products/${product.slug}`}
        className="product-card-link"
        aria-label={`${t("viewProduct")}: ${product.name}`}
      >
        <div className="product-card-image">
          <span className="product-card-brand" lang="en" dir="ltr">
            {product.division === "commodities" ? "SFGT" : "TOSHIBA"}
          </span>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className={
              product.division === "commodities"
                ? "product-card-photo product-card-photo-cover"
                : "product-card-photo product-card-photo-contain"
            }
            sizes="(max-width: 639px) 90vw, (max-width: 1023px) 44vw, 370px"
          />
        </div>
        <div className="product-card-content">
          <p className="product-card-category">
            {localize(category.name, locale)}
          </p>
          <h3 lang="en" dir="ltr" className="product-card-title">
            {product.name}
          </h3>
          {detail && (
            <p className="product-card-detail" lang="en" dir="ltr">
              {detail}
            </p>
          )}
          <span className="product-card-action">
            <span>{t("viewProduct")}</span>
            <ArrowUpRight aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}
