import { defineRouting } from "next-intl/routing";

/**
 * Internationalization routing configuration
 * @see https://next-intl.dev/docs/routing
 */
export const routing = defineRouting({
  // Supported locales
  locales: ["en", "ar"],

  // Default locale when no locale is detected
  defaultLocale: "en",

  // Only show locale prefix when not using default locale
  localePrefix: "as-needed",

  // Keep English as the default; visitors choose Arabic explicitly.
  localeDetection: false,
});

/**
 * Type for supported locales
 */
export type Locale = (typeof routing.locales)[number];

/**
 * Type guard to check if a string is a valid locale
 */
export function isValidLocale(locale: string): locale is Locale {
  return routing.locales.includes(locale as Locale);
}
