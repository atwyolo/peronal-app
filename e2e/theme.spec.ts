import { expect, test } from "./fixtures";

// Theme via next-themes: follows the OS by default, a stored choice wins, applied before React hydrates.
const darkBackground = "rgb(16, 20, 42)";
const lightBackground = "rgb(243, 245, 249)";

test.describe("OS dark scheme", () => {
  test.use({ colorScheme: "dark" });

  test("uses the dark palette", async ({ page }) => {
    await page.goto("/en");

    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
    await expect(page.locator("body")).toHaveCSS("background-color", darkBackground);
  });
});

test.describe("OS light scheme", () => {
  test.use({ colorScheme: "light" });

  test("uses the light palette", async ({ page }) => {
    await page.goto("/en");

    await expect(page.locator("html")).toHaveClass(/\blight\b/);
    await expect(page.locator("body")).toHaveCSS("background-color", lightBackground);
  });

  test("a stored choice wins over the OS scheme", async ({ page }) => {
    // The theme menu (header step) will write this same next-themes key.
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await page.goto("/en");

    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
    await expect(page.locator("body")).toHaveCSS("background-color", darkBackground);
  });
});

test.describe("before hydration", () => {
  test.use({ colorScheme: "dark", allowedConsoleErrors: [/Failed to load resource/] });

  test("the inline script applies the theme without the React bundle (no flash)", async ({ page }) => {
    // Block every JS chunk: React never hydrates, only the inline theme script in the static HTML runs.
    await page.route("**/_next/static/chunks/**/*.js", (route) => route.abort());
    await page.goto("/en");

    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
  });
});

test.describe("theme menu", () => {
  test.use({ colorScheme: "light" });

  test("switches the theme and keeps the choice after a reload", async ({ page }) => {
    await page.goto("/en");

    await page.getByRole("banner").getByRole("button", { name: "Theme" }).click();
    const menu = page.getByRole("menu", { name: "Theme" });
    await expect(menu.getByRole("menuitemradio", { name: /System/ })).toHaveAttribute("aria-checked", "true");
    await expect(menu.getByRole("menuitemradio", { name: /System/ })).toContainText("now light");

    await menu.getByRole("menuitemradio", { name: "Dark" }).click();
    await expect(menu).toBeHidden();
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);

    await page.reload();
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
    await expect(page.locator("body")).toHaveCSS("background-color", darkBackground);
  });
});

