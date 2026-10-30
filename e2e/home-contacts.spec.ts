import { expect, test } from "./fixtures";

// Contact buttons: stacked under the photo, links built from the profile. The CV is checked by its URL only:
// downloading it would hit Blob on every run.
test("lists WhatsApp, mail, LinkedIn and the CV in that order", async ({ page }) => {
  await page.goto("/en");

  const links = page.getByRole("list", { name: "Contacts" }).getByRole("link");
  await expect(links).toHaveText([/WhatsApp/, /mikhail\.aleksandrov\.job/, /LinkedIn/, /Download CV/]);
});

test("links to the owner's channels", async ({ page }) => {
  await page.goto("/en");

  await expect(page.getByRole("link", { name: "WhatsApp: +374 93 310039" })).toHaveAttribute(
    "href",
    "https://wa.me/37493310039",
  );
  await expect(page.getByRole("link", { name: "Mail: mikhail.aleksandrov.job@gmail.com" })).toHaveAttribute(
    "href",
    "mailto:mikhail.aleksandrov.job@gmail.com",
  );
  await expect(page.getByRole("link", { name: "LinkedIn profile" })).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/mikhail-aleksandrov-job",
  );
});

test("opens WhatsApp and LinkedIn in a new tab, safely", async ({ page }) => {
  await page.goto("/en");

  for (const name of ["WhatsApp: +374 93 310039", "LinkedIn profile"]) {
    const link = page.getByRole("link", { name });
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
});

test("styles the WhatsApp button like the brand's own: white on WhatsApp green", async ({ page }) => {
  await page.goto("/en");

  const whatsapp = page.getByRole("link", { name: "WhatsApp: +374 93 310039" });
  await expect(whatsapp).toHaveCSS("background-color", "rgb(37, 211, 102)");
  await expect(whatsapp).toHaveCSS("color", "rgb(255, 255, 255)");
});

test("points the CV button at the blob download URL", async ({ page }) => {
  await page.goto("/en");

  const cv = page.getByRole("link", { name: "Download CV, PDF" });
  await expect(cv).toHaveAttribute("href", /\.vercel-storage\.com\/.+\.pdf\?download=1$/);
  await expect(cv).not.toHaveAttribute("target");
});

test("keeps every button 56px tall in the design frames", async ({ page }) => {
  await page.goto("/en");

  const links = page.getByRole("list", { name: "Contacts" }).getByRole("link");
  await expect(links).toHaveCount(4);
  for (const link of await links.all()) {
    expect((await link.boundingBox())?.height).toBe(56);
  }
});

test("does not widen the page", async ({ page }) => {
  await page.goto("/en");

  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(page.viewportSize()?.width);
});

test.describe("desktop", () => {
  test.skip(({ isMobile }) => isMobile, "the four-column grid starts at lg");

  test("sits in column 1 under the photo", async ({ page }) => {
    await page.goto("/en");

    const photo = await page.getByRole("img", { name: "Mikhail Aleksandrov" }).locator("..").boundingBox();
    const box = await page.getByRole("list", { name: "Contacts" }).boundingBox();
    expect(box?.x).toBeCloseTo(20, 0);
    expect(box?.width).toBeCloseTo(288, 0);
    expect(box?.y).toBeCloseTo((photo?.y ?? 0) + (photo?.height ?? 0) + 16, 0);
  });
});

test.describe("mobile", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile layout");

  test("spans the content width right after the photo", async ({ page }) => {
    await page.goto("/en");

    const photo = await page.getByRole("img", { name: "Mikhail Aleksandrov" }).locator("..").boundingBox();
    const box = await page.getByRole("list", { name: "Contacts" }).boundingBox();
    expect(box?.x).toBe(16);
    expect(box?.width).toBe(390 - 16 * 2);
    expect(box?.y).toBeCloseTo((photo?.y ?? 0) + (photo?.height ?? 0) + 12, 0);
  });
});
