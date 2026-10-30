import { describe, expect, it } from "vitest";
import { getCarouselIndex } from "./carousel-index";

const width = 358;
const gap = 12;
const total = 4;

describe("getCarouselIndex", () => {
  it.each([
    { scrollLeft: 0, index: 0 },
    { scrollLeft: 370, index: 1 },
    { scrollLeft: 740, index: 2 },
    { scrollLeft: 1110, index: 3 },
  ])("finds slide $index at a snapped offset of $scrollLeft", ({ scrollLeft, index }) => {
    expect(getCarouselIndex(scrollLeft, width, gap, total)).toBe(index);
  });

  it("switches to the next slide past the middle of a swipe", () => {
    expect(getCarouselIndex(184, width, gap, total)).toBe(0);
    expect(getCarouselIndex(186, width, gap, total)).toBe(1);
  });

  it("stays on the first slide before the track has a width", () => {
    expect(getCarouselIndex(0, 0, 0, total)).toBe(0);
  });

  it("stays in range during the overscroll bounce on iOS", () => {
    expect(getCarouselIndex(-40, width, gap, total)).toBe(0);
    expect(getCarouselIndex(1600, width, gap, total)).toBe(3);
  });
});
