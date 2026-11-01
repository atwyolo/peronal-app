import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

import { getProfile } from "@/db/queries/home";
import { getLocaleAlternates } from "@/shared/lib/i18n/alternates";
import { locales } from "@/shared/lib/locales";

/**
 * Home page metadata in the page's language. Title and description come from the profile in the database
 * (editable in the admin later); getProfile is cached, so the page and its metadata share one read.
 */
export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale();
  const profile = await getProfile(locale);

  const title = `${profile.name} — ${profile.headline}`;
  const alternates = getLocaleAlternates(locale);

  return {
    title,
    description: profile.metaDescription,
    alternates,
    openGraph: {
      type: "website",
      title,
      description: profile.metaDescription,
      url: alternates.canonical,
      siteName: profile.name,
      locale,
      alternateLocale: locales.filter((l) => l !== locale),
    },
  };
};
