import type messages from "../../../../messages/en.json";
import type { Locale } from "@/shared/lib/locales";

// Strict types for next-intl: `useLocale()` returns our Locale, `t("Header.nav.home")` keys are checked against en.json.
declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof messages;
  }
}
