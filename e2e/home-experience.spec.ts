import { expect, test } from "./fixtures";

// Experience block: the jobs from the database. "Learn more" and "All experience" lead to /projects, a 404 for now.
test("shows the jobs from the database in their order", async ({ page }) => {
  await page.goto("/en");

  const section = page.getByRole("region", { name: "Experience" });
  await expect(section.getByRole("heading", { level: 2, name: "Experience" })).toBeVisible();
  await expect(section.getByRole("heading", { level: 3 })).toHaveText(["Glovo", "Sony PlayStation", "EPAM", "Omega-R"]);
  await expect(section.getByText("11/2024 – 10/2026 · 2 years")).toBeVisible();
  await expect(section.getByRole("article").first().getByRole("listitem")).not.toHaveCount(0);
});

test("keeps the current locale in the links", async ({ page }) => {
  await page.goto("/de");

  const section = page.getByRole("region", { name: "Experience" });
  await expect(section.getByRole("link", { name: "Learn more" }).first()).toHaveAttribute("href", "/de/projects");
  await expect(section.getByRole("link", { name: "All experience" })).toHaveAttribute("href", "/de/projects");
});

test("styles all experience as the primary pill", async ({ page }) => {
  await page.goto("/en");

  const link = page.getByRole("region", { name: "Experience" }).getByRole("link", { name: "All experience" });
  await expect(link).toHaveCSS("height", "44px");
  await expect(link).toHaveCSS("text-decoration-line", "none");

  // A pill: the browser reports `rounded-full` as a huge number, so compare it with half the 44px height.
  const radius = await link.evaluate((element) => Number.parseFloat(getComputedStyle(element).borderTopLeftRadius));
  expect(radius).toBeGreaterThanOrEqual(22);
});

test.describe("desktop layout", () => {
  test.skip(({ isMobile }) => isMobile, "the four-column grid starts at lg");

  test("puts the cards in one row of equal height and the pill on the right", async ({ page }) => {
    await page.goto("/en");

    const section = page.getByRole("region", { name: "Experience" });
    const boxes = await section.getByRole("article").evaluateAll((cards) =>
      cards.map((card) => {
        const { top, height } = card.getBoundingClientRect();
        return { top, height };
      }),
    );

    expect(boxes).toHaveLength(4);
    expect(new Set(boxes.map((box) => box.top)).size).toBe(1);
    expect(new Set(boxes.map((box) => box.height)).size).toBe(1);

    const sectionBox = await section.boundingBox();
    const pillBox = await section.getByRole("link", { name: "All experience" }).boundingBox();
    expect(pillBox!.x + pillBox!.width).toBeCloseTo(sectionBox!.x + sectionBox!.width, 0);
    expect(pillBox!.width).toBeLessThan(sectionBox!.width / 2);
  });

  test("pins learn more to the bottom of every card", async ({ page }) => {
    await page.goto("/en");

    const links = page.getByRole("region", { name: "Experience" }).getByRole("link", { name: "Learn more" });
    const bottoms = await links.evaluateAll((items) => items.map((item) => item.getBoundingClientRect().bottom));

    expect(new Set(bottoms).size).toBe(1);
  });
});

test.describe("mobile layout", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile layout");

  test("stretches the pill over the whole block", async ({ page }) => {
    await page.goto("/en");

    const section = page.getByRole("region", { name: "Experience" });
    const sectionBox = await section.boundingBox();
    const pillBox = await section.getByRole("link", { name: "All experience" }).boundingBox();

    expect(pillBox!.width).toBe(sectionBox!.width);
  });
});
