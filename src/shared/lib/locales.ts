/**
 * Supported locales. Single source for the database enum now and for next-intl routing in Stage 2.
 * `en` is the default and the fallback: its translation rows are always complete.
 */
export const locales = ["en", "ru", "pt", "es", "de", "fr", "ja", "pl"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
