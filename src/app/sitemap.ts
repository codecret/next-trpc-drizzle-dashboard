import type { MetadataRoute } from "next";
import {
  categories,
  products,
  auditedAt,
} from "@/features/catalogue/catalogue";
import { absoluteUrl } from "@/features/catalogue/metadata";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/about",
    "/products",
    "/services",
    "/support",
    "/contact",
    ...categories.map((category) => `/products/${category.slug}`),
    ...products.map((product) => `/products/${product.slug}`),
  ];
  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(path, locale),
      lastModified: new Date(auditedAt),
      alternates: {
        languages: {
          en: absoluteUrl(path),
          ar: absoluteUrl(path, "ar"),
          "x-default": absoluteUrl(path),
        },
      },
    }))
  );
}
