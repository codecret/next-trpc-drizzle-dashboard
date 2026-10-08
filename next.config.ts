import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import legacyRedirects from "./src/features/catalogue/data/legacy-redirects.json";

const withNextIntl = createNextIntlPlugin();
const nextConfig: NextConfig = {
  async redirects() {
    return legacyRedirects.map((redirect) => ({
      ...redirect,
      has: redirect.has?.map((condition) => ({
        ...condition,
        type: "query" as const,
      })),
    }));
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shadcnblocks.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
