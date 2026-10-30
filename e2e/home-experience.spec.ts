import type { Page } from "@playwright/test";

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

  test("hides the carousel controls and does not scroll sideways", async ({ page }) => {
    await page.goto("/en");

    const carousel = page.getByRole("group", { name: "Experience" });
    await expect(carousel.getByText("1 / 4")).toBeHidden();
    await expect(carousel.getByRole("button", { name: "Next" })).toBeHidden();

    const track = page.getByRole("group", { name: "1 of 4" }).locator("..");
    await expect(track).toHaveCSS("display", "grid");
    await expect(track).toHaveCSS("scroll-snap-type", "none");
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

  const getCarousel = (page: Page) => page.getByRole("group", { name: "Experience" });
  const getTrack = (page: Page) => page.getByRole("group", { name: "1 of 4" }).locator("..");

  test("shows one card with the position and the arrows above it", async ({ page }) => {
    await page.goto("/en");

    const carousel = getCarousel(page);
    const position = carousel.getByText("1 / 4");
    const firstCard = page.getByRole("group", { name: "1 of 4" });
    await firstCard.scrollIntoViewIfNeeded();
    await expect(position).toBeVisible();
    await expect(firstCard).toBeInViewport();
    await expect(page.getByRole("group", { name: "2 of 4" })).not.toBeInViewport();

    const positionBox = await position.boundingBox();
    const cardBox = await firstCard.boundingBox();
    expect(positionBox!.y).toBeLessThan(cardBox!.y);
    expect(cardBox!.width).toBe(358);

    const next = carousel.getByRole("button", { name: "Next" });
    await expect(next).toHaveCSS("height", "44px");
    await expect(next).toHaveCSS("width", "44px");
    await expect(next).toHaveCSS("opacity", "1");
    await expect(carousel.getByRole("button", { name: "Previous" })).toHaveCSS("opacity", "0.35");
  });

  test("moves between cards with the arrows, up to the last one", async ({ page }) => {
    await page.goto("/en");

    const carousel = getCarousel(page);
    const next = carousel.getByRole("button", { name: "Next" });

    for (const position of ["2 / 4", "3 / 4", "4 / 4"]) {
      await next.click();
      await expect(carousel.getByText(position)).toBeVisible();
      await expect.poll(() => getTrack(page).evaluate((track) => track.scrollLeft % 370)).toBe(0);
    }

    await expect(page.getByRole("group", { name: "4 of 4" })).toBeInViewport();
    await expect(next).toHaveAttribute("aria-disabled", "true");

    await carousel.getByRole("button", { name: "Previous" }).click();
    await expect(carousel.getByText("3 / 4")).toBeVisible();
  });

  test("snaps to the next card and updates the position after a swipe", async ({ page }) => {
    await page.goto("/en");

    const firstCard = await page.getByRole("group", { name: "1 of 4" }).boundingBox();
    await page.getByRole("group", { name: "1 of 4" }).scrollIntoViewIfNeeded();

    // A real touch gesture, so the browser's own scroll-snap decides where the track stops.
    const client = await page.context().newCDPSession(page);
    const box = await getTrack(page).boundingBox();
    await client.send("Input.synthesizeScrollGesture", {
      x: box!.x + box!.width / 2,
      y: box!.y + 200,
      xDistance: -220,
      gestureSourceType: "touch",
    });

    await expect(getCarousel(page).getByText("2 / 4")).toBeVisible();
    await expect.poll(() => getTrack(page).evaluate((track) => track.scrollLeft)).toBe(firstCard!.width + 12);
  });

  test("keeps the focus on an arrow when it turns off", async ({ page }) => {
    await page.goto("/en");

    const carousel = getCarousel(page);
    const next = carousel.getByRole("button", { name: "Next" });
    for (const position of ["2 / 4", "3 / 4", "4 / 4"]) {
      await next.focus();
      await page.keyboard.press("Enter");
      await expect(carousel.getByText(position)).toBeVisible();
    }

    await expect(next).toBeFocused();
    // The focus ring must stay readable on an arrow that is otherwise dimmed.
    await expect(next).toHaveAttribute("aria-disabled", "true");
    await expect(next).toHaveCSS("opacity", "1");
  });

  test("follows the keyboard focus into a card that is off screen", async ({ page }) => {
    await page.goto("/en");

    const carousel = getCarousel(page);
    await carousel.getByRole("button", { name: "Next" }).focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    await expect(page.getByRole("group", { name: "2 of 4" }).getByRole("link", { name: "Learn more" })).toBeFocused();
    await expect(carousel.getByText("2 / 4")).toBeVisible();
  });

  test("scrolls smoothly from the arrows", async ({ page }) => {
    await page.goto("/en");

    await expect(getTrack(page)).toHaveCSS("scroll-behavior", "smooth");
  });

  test.describe("with reduced motion", () => {
    test.use({ contextOptions: { reducedMotion: "reduce" } });

    test("jumps between cards", async ({ page }) => {
      await page.goto("/en");

      await expect(getTrack(page)).toHaveCSS("scroll-behavior", "auto");
    });
  });

  test("does not widen the page", async ({ page }) => {
    await page.goto("/en");

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBe(0);
  });

  test("stretches the pill over the whole block", async ({ page }) => {
    await page.goto("/en");

    const section = page.getByRole("region", { name: "Experience" });
    const sectionBox = await section.boundingBox();
    const pillBox = await section.getByRole("link", { name: "All experience" }).boundingBox();

    expect(pillBox!.width).toBe(sectionBox!.width);
  });
});
