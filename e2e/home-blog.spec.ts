import type { Locator, Page } from "@playwright/test";

import { expect, test } from "./fixtures";

const getSection = (page: Page) => page.getByRole("region", { name: "Blog" });
const getCards = (page: Page) => getSection(page).getByRole("article");
const getTopic = (card: Locator) => card.locator("time").locator("..").locator("span");

// The block reads the three latest posts. The owner replaces the demo posts, so the tests read properties, not titles.
test("shows the three latest posts from the newest down", async ({ page }) => {
  await page.goto("/en");

  await expect(getSection(page).getByRole("heading", { level: 2, name: "Blog" })).toBeVisible();
  await expect(getCards(page)).toHaveCount(3);

  const dates = await getCards(page)
    .locator("time")
    .evaluateAll((times) => times.map((time) => time.getAttribute("datetime")!));
  expect(dates).toEqual(dates.toSorted().reverse());
});

test("puts a topic badge before the date, on one line", async ({ page }) => {
  await page.goto("/en");

  const card = getCards(page).first();
  const date = await card.locator("time").boundingBox();
  const badge = await getTopic(card).boundingBox();

  expect(badge!.x + badge!.width).toBeLessThan(date!.x);
  expect(badge!.y + badge!.height / 2).toBeCloseTo(date!.y + date!.height / 2, 0);
});

test("styles the topic as the design's badge", async ({ page }) => {
  await page.goto("/en");

  const badge = getTopic(getCards(page).first());
  await expect(badge).toHaveCSS("text-transform", "uppercase");
  await expect(badge).toHaveCSS("font-size", "11px");
  await expect(badge).toHaveCSS("border-radius", "6px");
  await expect(badge).toHaveCSS("padding", "5px 8px");
});

test("sets the text to the design's line heights", async ({ page, isMobile }) => {
  await page.goto("/en");

  const titles = getCards(page).getByRole("heading", { level: 3 });
  await expect(titles.first()).toHaveCSS("line-height", isMobile ? "24.7px" : "27.5px");
  await expect(titles.nth(1)).toHaveCSS("line-height", isMobile ? "22.1px" : "23.4px");
  await expect(getCards(page).nth(1).locator("h3 + p")).toHaveCSS("line-height", "23.25px");
});

test("translates the topic with the page", async ({ page }) => {
  await page.goto("/ru");

  await expect(getTopic(getCards(page).first())).toHaveText(/^[А-ЯЁа-яё ]+$/);
});

test("leads to the posts and to the blog in the current locale", async ({ page }) => {
  await page.goto("/de");

  await expect(getCards(page).first().getByRole("link", { name: "Read more" })).toHaveAttribute(
    "href",
    /^\/de\/blog\/[a-z0-9-]+$/,
  );
  await expect(getSection(page).getByRole("link", { name: "All posts" })).toHaveAttribute("href", "/de/blog");
});

test("gives only the first post a cover", async ({ page }) => {
  await page.goto("/en");

  await expect(getCards(page).first().getByRole("img")).toHaveCount(1);
  await expect(getCards(page).nth(1).getByRole("img")).toHaveCount(0);
  await expect(getCards(page).nth(2).getByRole("img")).toHaveCount(0);
});

test.describe("desktop layout", () => {
  test.skip(({ isMobile }) => isMobile, "the grid starts at lg");

  test("spans the first post over two of four columns and puts the link on the right", async ({ page }) => {
    await page.goto("/en");

    const [first, second, third] = await getCards(page).evaluateAll((cards) =>
      cards.map((card) => {
        const { x, y, width, height } = card.getBoundingClientRect();
        return { x, y, width, height };
      }),
    );

    expect(first.width).toBeCloseTo(second.width * 2 + 16, 0);
    expect(third.width).toBeCloseTo(second.width, 0);
    expect(second.y).toBe(first.y);
    expect(second.height).toBe(first.height);
    expect(third.height).toBe(first.height);

    const sectionBox = await getSection(page).boundingBox();
    const linkBox = await getSection(page).getByRole("link", { name: "All posts" }).boundingBox();
    expect(linkBox!.x + linkBox!.width).toBeCloseTo(sectionBox!.x + sectionBox!.width, 0);
    expect(linkBox!.width).toBeLessThan(sectionBox!.width / 2);
  });

  test("sets the cover to the left of the first post's text", async ({ page }) => {
    await page.goto("/en");

    const card = getCards(page).first();
    const cover = await card.getByRole("img").boundingBox();
    const title = await card.getByRole("heading", { level: 3 }).boundingBox();

    expect(cover!.width).toBe(220);
    expect(cover!.height).toBeGreaterThanOrEqual(240);
    expect(cover!.x + cover!.width).toBeLessThan(title!.x);
  });

  test("keeps a long topic inside its card at the narrowest desktop width", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto("/en");

    const card = getCards(page).nth(2);
    // The longest label of the eight locales, whatever topic this post has.
    await getTopic(card).evaluate((topic) => {
      topic.textContent = "Oprogramowanie";
    });
    const cardBox = await card.boundingBox();
    const badge = await getTopic(card).boundingBox();
    const date = await card.locator("time").boundingBox();

    expect(badge!.x + badge!.width).toBeLessThanOrEqual(cardBox!.x + cardBox!.width);
    // The date moves to its own line whole, it does not break next to the badge.
    expect(date!.y).toBeGreaterThanOrEqual(badge!.y + badge!.height);
    expect(date!.height).toBeLessThan(24);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1024);
  });
});

test.describe("mobile layout", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile layout");

  test("shows one post per view with the carousel's controls", async ({ page }) => {
    await page.goto("/en");

    const carousel = getSection(page).getByRole("group", { name: "Blog" });
    await expect(carousel.getByText("1 / 3")).toBeVisible();

    await carousel.getByRole("button", { name: "Next" }).click();
    await expect(carousel.getByText("2 / 3")).toBeVisible();
    await expect(getCards(page).nth(1).getByRole("heading", { level: 3 })).toBeInViewport();
  });

  test("puts the cover above the first post and stretches the link over the block", async ({ page }) => {
    await page.goto("/en");

    const card = getCards(page).first();
    const cover = await card.getByRole("img").boundingBox();
    const meta = await card.locator("time").boundingBox();
    expect(cover!.height).toBe(150);
    expect(cover!.y + cover!.height).toBeLessThan(meta!.y);

    const sectionBox = await getSection(page).boundingBox();
    const linkBox = await getSection(page).getByRole("link", { name: "All posts" }).boundingBox();
    expect(linkBox!.width).toBe(sectionBox!.width);
  });
});

for (const width of [390, 720, 1024, 1280]) {
  test(`does not widen the page at ${width} px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/en");

    await expect(getCards(page).first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  });
}
