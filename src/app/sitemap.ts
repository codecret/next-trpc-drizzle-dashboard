import type { MetadataRoute } from "next";
import {
  categories,
  products,
  auditedAt,
} from "@/features/catalogue/catalogue";
import { absoluteUrl } from "@/features/catalogue/metadata";

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
    ["en", "de"].map((locale) => ({
      url: absoluteUrl(path, locale),
      lastModified: new Date(auditedAt),
      alternates: {
        languages: {
          en: absoluteUrl(path),
          de: absoluteUrl(path, "de"),
          "x-default": absoluteUrl(path),
        },
      },
    }))
  );
}
