import Image from "next/image";
import {
  ArrowRight,
  Battery,
  BatteryCharging,
  Lightbulb,
  Plug,
  Zap,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { productBySlug } from "@/features/catalogue/catalogue";
import { PremiumProductCarousel } from "./premium-product-carousel";
import "./premium-products.css";

const featuredProducts = [
  {
    key: "highPower",
    slug: "high-power-aa-bp-4-blister-pack",
    type: "batteries",
    size: "AA",
    attribute: "alkaline",
  },
  {
    key: "alphaPower",
    slug: "alpha-power-aa-bp-4-blister-pack",
    type: "batteries",
    size: "AA",
    attribute: "alkaline",
  },
  {
    key: "rechargeable",
    slug: "tnh-6gae-bp-2c",
    type: "batteries",
    size: "AA",
    attribute: "rechargeable",
  },
  {
    key: "lighting",
    slug: "toshiba-standard-a-bulb-4-7w",
    type: "lighting",
    size: "4.7W",
    attribute: "E27",
  },
] as const;

export async function PremiumProducts({ locale }: { locale: string }) {
  const t = await getTranslations({
    locale,
    namespace: "Website.premiumProducts",
  });

  return (
    <section
      id="featured-products"
      className="premium-featured"
      aria-labelledby="premium-featured-title"
    >
      <div className="premium-container">
        <div
          className="premium-products-heading premium-section-heading"
          data-premium-reveal
        >
          <div>
            <h2 id="premium-featured-title">{t("heading")}</h2>
            <p className="premium-products-description">{t("description")}</p>
          </div>
          <Link href="/products" className="premium-link">
            {t("viewAll")}
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <PremiumProductCarousel
          productTypes={featuredProducts.map((product) => product.type)}
        >
          {featuredProducts.map((item) => {
            const product = productBySlug.get(item.slug)!;
            const isLighting = item.type === "lighting";
            const AttributeIcon = isLighting
              ? Plug
              : item.attribute === "rechargeable"
                ? BatteryCharging
                : Zap;

            return (
              <article
                className="premium-product-card"
                key={product.id}
                data-product-type={item.type}
                data-premium-reveal
                aria-labelledby={`premium-product-${product.id}`}
              >
                <Link
                  href={`/products/${product.slug}`}
                  className={`premium-product-image ${isLighting ? "premium-product-image-lighting" : ""}`}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <Image
                    src={product.images[0]}
                    alt=""
                    width={360}
                    height={480}
                    sizes="(max-width: 767px) 80vw, (max-width: 1023px) 40vw, 240px"
                  />
                </Link>
                <div className="premium-product-content">
                  <h3 id={`premium-product-${product.id}`}>
                    <Link href={`/products/${product.slug}`}>
                      {t(`products.${item.key}`)}
                    </Link>
                  </h3>
                  <p className="premium-product-model" lang="en" dir="ltr">
                    {product.productCode || product.name}
                  </p>
                  <ul
                    className="premium-product-attributes"
                    aria-label={t("attributes")}
                  >
                    <li>
                      {isLighting ? (
                        <Lightbulb size={16} aria-hidden="true" />
                      ) : (
                        <Battery size={16} aria-hidden="true" />
                      )}
                      <bdi>{item.size}</bdi>
                    </li>
                    <li>
                      <AttributeIcon size={16} aria-hidden="true" />
                      <span>
                        {isLighting
                          ? item.attribute
                          : t(`attributesText.${item.attribute}`)}
                      </span>
                    </li>
                  </ul>
                  <div className="premium-product-actions">
                    <Link
                      href={`/products/${product.slug}`}
                      className="premium-product-detail"
                    >
                      {t("details")}
                      <ArrowRight size={17} aria-hidden="true" />
                    </Link>
                    <a
                      href="#quotation"
                      className="premium-product-enquiry"
                      data-enquiry-product={`${product.name}${product.productCode ? ` (${product.productCode})` : ""}`}
                      data-enquiry-division="toshiba"
                      aria-label={t("enquireAbout", {
                        product: t(`products.${item.key}`),
                      })}
                    >
                      {t("enquire")}
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </PremiumProductCarousel>
      </div>
    </section>
  );
}

export async function ToshibaShowcase({ locale }: { locale: string }) {
  const t = await getTranslations({
    locale,
    namespace: "Website.premiumProducts",
  });
  const ranges = [
    {
      key: "alkaline",
      href: "/products/alkaline-batteries",
    },
    {
      key: "rechargeable",
      href: "/products/rechargeable-batteries",
    },
    {
      key: "lighting",
      href: "/products/led-lighting",
    },
  ] as const;

  return (
    <section
      id="toshiba-products"
      className="premium-toshiba"
      aria-labelledby="premium-toshiba-title"
    >
      <div className="premium-container">
        <div className="premium-toshiba-banner" data-premium-reveal>
          <div className="premium-toshiba-art" aria-hidden="true">
            <Image
              src="/images/premium-home/toshiba-showcase.webp"
              unoptimized
              alt=""
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1440px) 46vw, 612px"
            />
          </div>
          <div className="premium-toshiba-copy">
            <p className="premium-toshiba-wordmark">TOSHIBA</p>
            <h2 id="premium-toshiba-title">{t("showcase.heading")}</h2>
            <p className="premium-toshiba-description">
              {t("showcase.description")}
            </p>
            <Link href="/products/batteries" className="premium-button">
              {t("showcase.action")}
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <nav
            className="premium-toshiba-ranges"
            aria-label={t("showcase.rangeLabel")}
          >
            {ranges.map((range) => {
              return (
                <Link
                  href={range.href}
                  key={range.key}
                  className={`premium-toshiba-range premium-toshiba-range-${range.key}`}
                >
                  <Image
                    src={`/images/premium-home/${range.key}-thumb.webp`}
                    alt=""
                    unoptimized
                    width={72}
                    height={96}
                    sizes="68px"
                  />
                  <span>
                    <strong>{t(`showcase.ranges.${range.key}.title`)}</strong>
                    <small>
                      {t(`showcase.ranges.${range.key}.description`)}
                    </small>
                  </span>
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </section>
  );
}
