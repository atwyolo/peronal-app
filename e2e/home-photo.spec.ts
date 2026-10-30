import { expect, test } from "./fixtures";

// Photo tile: the LCP element of the home page, served through the Next image optimizer.
test("loads the photo through the image optimizer as AVIF", async ({ page }) => {
  const optimized = page.waitForResponse((response) => response.url().includes("/_next/image"));
  await page.goto("/en");

  expect((await optimized).headers()["content-type"]).toBe("image/avif");

  const photo = page.getByRole("img", { name: "Mikhail Aleksandrov" });
  await expect(photo).toBeVisible();
  await expect.poll(() => photo.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
});

test("preloads the photo, since it is the LCP element", async ({ page }) => {
  await page.goto("/en");

  await expect(page.locator('head link[rel="preload"][as="image"]')).toHaveCount(1);
});

test.describe("desktop", () => {
  test.skip(({ isMobile }) => isMobile, "the four-column grid starts at lg");

  test("fills column 1 and is at least 380px tall", async ({ page }) => {
    await page.goto("/en");

    const box = await page.getByRole("img", { name: "Mikhail Aleksandrov" }).locator("..").boundingBox();
    // Viewport 1280: container 1200 at x 40, padding 40, columns (1120 - 3 * 16) / 4 = 268.
    expect(box?.x).toBeCloseTo(40 + 40, 0);
    expect(box?.width).toBeCloseTo(268, 0);
    expect(box?.height).toBeGreaterThanOrEqual(380);
  });
});

test.describe("mobile", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile layout");

  test("is a square across the full content width, right after the hero", async ({ page }) => {
    await page.goto("/en");

    const hero = await page.getByRole("region", { name: "Mikhail Aleksandrov" }).boundingBox();
    const box = await page.getByRole("img", { name: "Mikhail Aleksandrov" }).locator("..").boundingBox();
    expect(box?.x).toBe(16);
    expect(box?.width).toBe(390 - 16 * 2);
    expect(box?.height).toBe(box?.width);
    expect(box?.y).toBeGreaterThan((hero?.y ?? 0) + (hero?.height ?? 0));
  });
});
