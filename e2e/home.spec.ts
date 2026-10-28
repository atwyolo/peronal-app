import { expect, test } from "@playwright/test";

// Smoke test: the home page renders content that comes from the database.
test("home page shows the profile from the database", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "Mikhail Aleksandrov" })).toBeVisible();
  await expect(page.getByText("Senior Frontend Software Engineer, 8+ years")).toBeVisible();
  await expect(page.getByRole("link", { name: /\+374/ })).toHaveAttribute("href", "https://wa.me/37493310039");
});
