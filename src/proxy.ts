import createMiddleware from "next-intl/middleware";

import { routing } from "@/shared/lib/i18n/routing";

/**
 * Next 16 proxy (formerly middleware). next-intl redirects paths without a locale ("/" -> "/ru")
 * and passes localized paths through, so prerendered pages stay static. Admin auth joins here later.
 */
export default createMiddleware(routing);

export const config = {
  // Pages only: skip /api, Next internals, Vercel internals and files with an extension (favicon.ico, cv.pdf).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
