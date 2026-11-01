/**
 * Absolute origin of the site, for `metadataBase` (canonical, hreflang, Open Graph URLs).
 * On Vercel, VERCEL_PROJECT_PRODUCTION_URL is the production domain (the custom one once added, *.vercel.app
 * before that), also in preview builds, so previews point search engines at production. Locally: localhost.
 */
export const siteUrl = new URL(
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : `http://localhost:${process.env.PORT ?? 3000}`,
);
