import { expect, test } from "./fixtures";

// Header frame: name linking home, desktop navigation with the current page marked, sticky on scroll.
test("the name links to the home page of the current locale", async ({ page }) => {
  await page.goto("/ru");

  const header = page.getByRole("banner");
  await expect(header.getByRole("link", { name: "Mikhail Aleksandrov" })).toHaveAttribute("href", "/ru");
});

test("stays at the top of the viewport while scrolling", async ({ page }) => {
  await page.goto("/en");
  await page.mouse.wheel(0, 2000);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

  const box = await page.getByRole("banner").boundingBox();
  expect(box?.y).toBe(0);
});

test.describe("desktop", () => {
  test.skip(({ isMobile }) => isMobile, "the navigation is shown from lg");

  test("shows every section in the current locale and marks the current page", async ({ page }) => {
    await page.goto("/de");

    const nav = page.getByRole("navigation", { name: "Main navigation" });
    const links = nav.getByRole("link");
    await expect(links).toHaveText(["Home", "About", "Projects", "Blog", "Contact"]);
    const hrefs = await links.evaluateAll((anchors) => anchors.map((a) => a.getAttribute("href")));
    expect(hrefs).toEqual(["/de", "/de/about", "/de/projects", "/de/blog", "/de/contact"]);
    await expect(nav.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
  });
});

test.describe("mobile", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile layout only");

  test("hides the desktop navigation", async ({ page }) => {
    await page.goto("/en");

    await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeHidden();
  });
});
