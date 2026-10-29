import { type Locale, locales } from "@/shared/lib/locales";

export interface LocaleAlternates {
  canonical: string;
  languages: Record<Locale | "x-default", string>;
}

/**
 * `alternates` for Next metadata: the page's own URL as canonical, one hreflang link per locale,
 * and `x-default` pointing at the unprefixed path, which the proxy redirects to the visitor's language.
 * Paths are relative; the root layout's `metadataBase` makes them absolute.
 *
 * @param pathname Path after the locale, starting with "/" ("" for the home page).
 */
export const getLocaleAlternates = (locale: Locale, pathname = ""): LocaleAlternates => {
  const languages = Object.fromEntries(locales.map((l) => [l, `/${l}${pathname}`])) as Record<Locale, string>;

  return {
    canonical: `/${locale}${pathname}`,
    languages: { ...languages, "x-default": pathname || "/" },
  };
};
