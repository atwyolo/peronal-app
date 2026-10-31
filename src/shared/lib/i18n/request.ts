import { notFound } from "next/navigation";
import * as rootParams from "next/root-params";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import type { Locale } from "@/shared/lib/locales";

import { mergeMessages, type MessagesTree } from "./merge-messages";
import { routing } from "./routing";

// Relative paths: messages/ lives in the repository root, outside the `@/*` alias.
const loadMessages = async (locale: Locale): Promise<MessagesTree> =>
  (await import(`../../../../messages/${locale}.json`)).default;

/**
 * Per-request i18n config (wired in next.config.ts). The locale is read from the root `[locale]` segment
 * through next/root-params, which keeps pages static with Cache Components.
 */
export default getRequestConfig(async (params) => {
  let { locale } = params;

  if (!locale) {
    const segment = await rootParams.locale();
    if (!hasLocale(routing.locales, segment)) notFound();
    locale = segment;
  }

  const fallback = await loadMessages(routing.defaultLocale);
  const messages = locale === routing.defaultLocale ? fallback : mergeMessages(fallback, await loadMessages(locale));

  // Without a zone next-intl uses the machine's, so a local and a Vercel build could print different dates.
  return { locale, messages, timeZone: "UTC" };
});
