import { expect, test } from "./fixtures";

// Hero tile: the first block of the home page, built from the profile (name, headline, hero skills).
test("shows the name as the page heading, the headline and the hero skills", async ({ page }) => {
  await page.goto("/en");

  const hero = page.getByRole("region", { name: "Mikhail Aleksandrov" });
  await expect(hero.getByRole("heading", { level: 1 })).toHaveText("Mikhail Aleksandrov");
  await expect(hero.getByText("Senior Frontend Software Engineer, 8+ years")).toBeVisible();
  await expect(hero.getByRole("listitem")).toHaveText(["React", "Redux", "Next.js", "Nest.js", "TypeScript", "Express"]);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
});

test.describe("desktop", () => {
  test.skip(({ isMobile }) => isMobile, "the four-column grid starts at lg");

  // Columns 2-4 of the 1200px container: column 1 is left for the photo and contacts.
  test("sits in columns 2 to 4 of the grid", async ({ page }) => {
    await page.goto("/en");

    const box = await page.getByRole("region", { name: "Mikhail Aleksandrov" }).boundingBox();
    // Viewport 1280: container 1200 at x 40, padding 40, columns (1120 - 3 * 16) / 4 = 268.
    expect(box?.x).toBeCloseTo(40 + 40 + 268 + 16, 0);
    expect(box?.width).toBeCloseTo(268 * 3 + 16 * 2, 0);
  });
});

test.describe("mobile", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile layout");

  test("spans the full content width", async ({ page }) => {
    await page.goto("/en");

    const box = await page.getByRole("region", { name: "Mikhail Aleksandrov" }).boundingBox();
    expect(box?.x).toBe(16);
    expect(box?.width).toBe(390 - 16 * 2);
  });
});
