import Image from "next/image";
import { ChevronRight, Lightbulb } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { localize } from "../catalogue";
import type { Category } from "../types";
import "./catalogue-cards.css";

export function CategoryCard({
  category,
  locale,
}: {
  category: Category;
  locale: string;
}) {
  const t = useTranslations("Website.catalogue");
  return (
    <Link href={`/products/${category.slug}`} className="category-card">
      <div className="category-card-image">
        {category.image ? (
          <Image
            src={category.image}
            alt=""
            fill
            className="category-card-photo"
            sizes="60px"
          />
        ) : (
          <Lightbulb className="size-6 text-neutral-500" aria-hidden="true" />
        )}
      </div>
      <div className="category-card-content">
        <h3>{localize(category.name, locale)}</h3>
        <p>
          {category.productCount
            ? t("productCount", { count: category.productCount })
            : t("rangeEnquiry")}
        </p>
      </div>
      <ChevronRight className="category-card-arrow" aria-hidden="true" />
    </Link>
  );
}
