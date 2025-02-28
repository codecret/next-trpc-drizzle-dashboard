import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "de", "ar"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});
