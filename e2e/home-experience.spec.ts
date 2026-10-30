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

test.describe("when an image fails to load", () => {
  test.use({ allowedConsoleErrors: [/status of 404/] });

  // Failing every image shows the placeholder whichever jobs have one in the database.
  test("frames the image area with the placeholder", async ({ page, isMobile }) => {
    await page.route("**/_next/image**", (route) => route.fulfill({ status: 404 }));
    await page.goto("/en");

    const placeholder = page.getByRole("region", { name: "Experience" }).getByRole("img", { name: "Glovo" });
    await expect.poll(() => placeholder.evaluate((element) => element.tagName)).toBe("DIV");
    await expect(placeholder).toHaveCSS("border-top-style", "dashed");
    await expect(placeholder).toHaveCSS("border-top-left-radius", "14px");
    // Thin lines, or the stripes hide the dashes of a border in the same color.
    await expect(placeholder).toHaveCSS("background-image", /^repeating-linear-gradient\(135deg,.* 1px, .* 10px\)$/);

    // `sizes` in ExperienceCard is derived from this box.
    const box = await placeholder.boundingBox();
    expect(box).toMatchObject({ width: isMobile ? 332 : 258, height: isMobile ? 140 : 180 });
  });
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

  // object-cover scales a 16:9 file by the 180px height: it renders 320px wide, more than the 194px card at this width.
  test("loads a file as wide as the image scaled by its height", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto("/en");

    const image = page.getByRole("region", { name: "Experience" }).getByRole("img", { name: "Glovo" });
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);

    const file = await image.evaluate((element: HTMLImageElement) => new URL(element.currentSrc).searchParams.get("w"));
    expect(Number(file)).toBeGreaterThanOrEqual(320);
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
