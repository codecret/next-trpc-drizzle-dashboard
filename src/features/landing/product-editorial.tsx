import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  categoryBySlug,
  localize,
  products,
} from "@/features/catalogue/catalogue";
import "./product-editorial.css";

export function ProductEditorial({ locale }: { locale: string }) {
  const t = useTranslations("Website");
  const featured = ["battery-1", "led-1", "battery-77"].map((id) =>
    products.find((product) => product.id === id)!
  );

  return (
    <section
      id="product-index"
      className="product-editorial"
      aria-labelledby="product-index-title"
    >
      <div className="site-container">
        <div className="product-editorial-heading">
          <div>
            <p className="product-editorial-eyebrow">{t("home.featured")}</p>
            <h2 id="product-index-title">{t("home.featuredTitle")}</h2>
          </div>
          <Link href="/products" className="product-editorial-all">
            {t("nav.allProducts")}
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <div className="product-editorial-grid">
          {featured.map((product, index) => (
            <article className="product-editorial-card" key={product.id}>
              <Link
                href={"/products/" + product.slug}
                className="product-editorial-card-link"
                aria-label={t("catalogue.viewProduct") + ": " + product.name}
              >
                <div className="product-editorial-image">
                  <Image
                    src={
                      index === 2
                        ? "/images/campaign/batteries-lifestyle-v1.png"
                        : product.images[0]
                    }
                    alt={product.name}
                    fill
                    sizes="(max-width: 639px) 90vw, (max-width: 1360px) 30vw, 400px"
                    className={
                      index === 2
                        ? "product-editorial-image-lifestyle"
                        : "product-editorial-image-catalogue"
                    }
                  />
                </div>
                <div className="product-editorial-card-copy">
                  <p className="product-editorial-category">
                    {localize(
                      categoryBySlug.get(product.division)!.name,
                      locale
                    )}
                  </p>
                  <h3 lang="en">{product.name}</h3>
                  <p className="product-editorial-detail" lang="en">
                    {product.productCode || product.family}
                  </p>
                  <span className="product-editorial-action">
                    <span>
                      {t("catalogue.viewProduct")}
                      <ArrowRight aria-hidden="true" />
                    </span>
                    <ChevronRight aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
