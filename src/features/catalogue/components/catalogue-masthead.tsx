import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { localize } from "../catalogue";
import type { Category } from "../types";
import "./catalogue-design.css";

const labels = {
  en: {
    products: "Products in the catalogue",
    range: "Explore the range",
    index: "Product index",
    families: "Browse by range",
    enquiry: "On enquiry",
  },
  ar: {
    products: "منتجات في الكتالوج",
    range: "تصفّح المجموعة",
    index: "فهرس المنتجات",
    families: "تصفّح حسب المجموعة",
    enquiry: "عند الاستفسار",
  },
};

export function CatalogueMasthead({
  title,
  description,
  brand = "SFGT",
  count,
  locale,
  ranges,
  image,
}: {
  title: string;
  description: string;
  brand?: string;
  count: number;
  locale: string;
  ranges: Category[];
  image?: { src: string; alt: string; cover?: boolean };
}) {
  const copy = labels[locale === "ar" ? "ar" : "en"];
  return (
    <header
      className={`catalogue-masthead${image ? " catalogue-masthead-illustrated" : ""}`}
    >
      <div className="catalogue-masthead-copy">
        <p className="catalogue-identifier">
          <span lang="en" dir="ltr">
            {brand}
          </span>
          <span>{copy.index}</span>
        </p>
        <h1>{title}</h1>
        <p className="catalogue-masthead-description">{description}</p>
        <a href="#catalogue-results" className="catalogue-jump">
          {copy.range}
          <ArrowDown size={18} aria-hidden="true" />
        </a>
      </div>
      <div
        className={`catalogue-register${image ? " catalogue-register-visual" : ""}`}
      >
        {image && (
          <div
            className={`catalogue-masthead-image${image.cover ? " is-cover" : ""}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              sizes="(max-width: 767px) 90vw, (max-width: 1023px) 40vw, 540px"
            />
          </div>
        )}
        <div className="catalogue-register-number">
          <span>{count ? String(count).padStart(2, "0") : "—"}</span>
          <p>{count ? copy.products : copy.enquiry}</p>
          <span className="catalogue-register-mark" aria-hidden="true">
            +
          </span>
        </div>
      </div>
      {ranges.length > 0 && (
        <nav className="catalogue-range-index" aria-label={copy.families}>
          {ranges.map((range, index) => (
            <Link key={range.slug} href={`/products/${range.slug}`}>
              <span className="catalogue-range-index-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="catalogue-range-index-name">
                {localize(range.name, locale)}
              </span>
              <span className="catalogue-range-index-count">
                {range.productCount || copy.enquiry}
              </span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
