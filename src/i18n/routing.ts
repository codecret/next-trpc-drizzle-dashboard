import { defineRouting } from "next-intl/routing";

/**
 * Internationalization routing configuration
 * @see https://next-intl.dev/docs/routing
 */
export const routing = defineRouting({
  // Supported locales
  locales: ["en", "de"],

  // Default locale when no locale is detected
  defaultLocale: "en",

  // Only show locale prefix when not using default locale
  localePrefix: "as-needed",

  // Detect locale from Accept-Language header
  localeDetection: true,
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
