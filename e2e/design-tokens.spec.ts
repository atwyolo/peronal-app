import { expect, test } from "./fixtures";

// Design tokens from docs/design/home/tokens.css reach the page: palette for both themes and the Geist font.
// Visual regressions here (a self-referencing CSS variable, a lost palette) are easy to miss by eye.
test.describe("design tokens", () => {
  test("light theme uses the design palette and Geist", async ({ page }) => {
    await page.goto("/en");

    const body = page.locator("body");
    await expect(body).toHaveCSS("background-color", "rgb(243, 245, 249)");
    await expect(body).toHaveCSS("color", "rgb(16, 20, 42)");
    await expect(body).toHaveCSS("font-family", /Geist/);
  });

  test("dark theme switches the palette with the .dark class", async ({ page }) => {
    await page.goto("/en");
    // The theme switcher arrives in a later step; next-themes will toggle this same class.
    await page.evaluate(() => document.documentElement.classList.add("dark"));

    const body = page.locator("body");
    await expect(body).toHaveCSS("background-color", "rgb(16, 20, 42)");
    await expect(body).toHaveCSS("color", "rgb(237, 239, 247)");
  });
});
