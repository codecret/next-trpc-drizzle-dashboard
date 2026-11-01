import { getRequestConfig } from "next-intl/server";
import { routing, isValidLocale } from "./routing";

/**
 * Request configuration for next-intl
 * This is called for each request to determine the locale and load messages
 * @see https://next-intl.dev/docs/usage/configuration#i18nts
 */
export default getRequestConfig(async ({ requestLocale }) => {
  // Get the locale from the request (from [locale] segment)
  let locale = await requestLocale;

  // Validate and fallback to default locale if invalid
  if (!locale || !isValidLocale(locale)) {
    locale = routing.defaultLocale;
  }

  // Load messages for the locale
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
    // Timezone for date/time formatting
    timeZone: "UTC",
    // Date/time formatting options
    now: new Date(),
  };
});
