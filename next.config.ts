import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Points next-intl at the per-request config (locale + messages).
const withNextIntl = createNextIntlPlugin("./src/shared/lib/i18n/request.ts");

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Dev server only: the Mac's LAN address, to open the site on a phone. Update it if the router hands out a new one.
  allowedDevOrigins: ["192.168.1.116"],
  images: {
    // AVIF first, WebP for browsers without it. Every extra quality or format multiplies the variants Vercel encodes.
    formats: ["image/avif", "image/webp"],
    qualities: [85],
    // Only our Blob store: the optimizer must not work as an open proxy for other sites' images.
    remotePatterns: [new URL("https://5iyco5bcxydlbyja.public.blob.vercel-storage.com/**")],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);
