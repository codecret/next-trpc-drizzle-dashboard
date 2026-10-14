import type { Metadata } from "next";
import { env } from "@/lib/env";
import { brand, company } from "./catalogue";

export function siteOrigin() {
  return new URL(env.NEXT_PUBLIC_SITE_URL ?? env.NEXT_PUBLIC_BETTER_AUTH_URL)
    .origin;
}
export function localizedPath(path: string, locale: string) {
  return `${locale === "ar" ? "/ar" : ""}${path === "/" ? "" : path}` || "/";
}
export function absoluteUrl(path: string, locale = "en") {
  return new URL(localizedPath(path, locale), siteOrigin()).toString();
}
export function pageMetadata({
  title,
  description,
  path,
  locale,
  image,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  locale: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path, locale);
  const images = [
    {
      url: new URL(image || brand.batteries, siteOrigin()).toString(),
      alt: title,
    },
  ];
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: absoluteUrl(path),
        ar: absoluteUrl(path, "ar"),
        "x-default": absoluteUrl(path),
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: company.name,
      type: "website",
      locale: locale === "ar" ? "ar_AE" : "en_AE",
      alternateLocale: locale === "ar" ? "en_AE" : "ar_AE",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((image) => image.url),
    },
    robots: noIndex
      ? { index: false, follow: true }
      : { index: true, follow: true },
  };
}
