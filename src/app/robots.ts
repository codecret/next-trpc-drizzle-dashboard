import type { MetadataRoute } from "next";
import { siteOrigin } from "@/features/catalogue/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin",
        "/dashboard",
        "/auth",
        "/en/admin",
        "/en/dashboard",
        "/en/auth",
        "/de/admin",
        "/de/dashboard",
        "/de/auth",
      ],
    },
    sitemap: `${siteOrigin()}/sitemap.xml`,
    host: siteOrigin(),
  };
}
