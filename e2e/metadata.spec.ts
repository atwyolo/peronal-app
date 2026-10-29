import { expect, test } from "@playwright/test";

import { locales } from "@/shared/lib/locales";

// Localized <head>: title and description from the profile, canonical, hreflang for every locale + x-default.
const description =
  "I'm a Senior Frontend Engineer with 8+ years of commercial experience in React and Next.js, most recently at Glovo, Sony PlayStation and EPAM.";

for (const locale of ["en", "ru"] as const) {
  test(`/${locale} has localized metadata and hreflang links`, async ({ page }) => {
    await page.goto(`/${locale}`);

    // Untranslated locales fall back to the English profile.
    await expect(page).toHaveTitle("Mikhail Aleksandrov — Senior Frontend Software Engineer, 8+ years");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", description);
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", locale);

    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(new URL(canonical!).pathname).toBe(`/${locale}`);

    const alternates = await page
      .locator("link[rel='alternate'][hreflang]")
      .evaluateAll((links) => links.map((l) => [l.getAttribute("hreflang"), new URL(l.getAttribute("href")!).pathname]));
    expect(Object.fromEntries(alternates)).toEqual({
      ...Object.fromEntries(locales.map((l) => [l, `/${l}`])),
      "x-default": "/",
    });
  });
}
