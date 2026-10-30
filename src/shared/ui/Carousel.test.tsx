import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import messages from "../../../messages/en.json";
import { Carousel } from "./Carousel";

const slideWidth = 358;
const scrollTo = vi.fn();

const renderCarousel = (count = 4) =>
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <Carousel label="Experience">
        {Array.from({ length: count }, (_, index) => (
          <article key={index}>Card {index + 1}</article>
        ))}
      </Carousel>
    </NextIntlClientProvider>,
  );

const getTrack = () => screen.getByRole("group", { name: "1 of 4" }).parentElement as HTMLElement;

// jsdom has no layout: scrolling is the browser's job, so a test only reports where the track ended up.
const scrollTrackTo = (scrollLeft: number) => {
  const track = getTrack();
  Object.defineProperty(track, "clientWidth", { configurable: true, value: slideWidth });
  Object.defineProperty(track, "scrollLeft", { configurable: true, value: scrollLeft });
  fireEvent.scroll(track);
};

beforeEach(() => {
  Element.prototype.scrollTo = scrollTo;
});

afterEach(() => {
  scrollTo.mockClear();
  vi.restoreAllMocks();
});

describe("Carousel", () => {
  it("names the carousel and describes it to a screen reader", () => {
    renderCarousel();

    expect(screen.getByRole("group", { name: "Experience" })).toHaveAttribute("aria-roledescription", "carousel");
  });

  it("puts every child on a numbered slide", () => {
    renderCarousel();

    const slide = screen.getByRole("group", { name: "2 of 4" });

    expect(slide).toHaveAttribute("aria-roledescription", "slide");
    expect(within(slide).getByRole("article")).toHaveTextContent("Card 2");
  });

  it("starts on the first slide with only the next arrow active", () => {
    renderCarousel();

    expect(screen.getByText("1 / 4")).toBeVisible();
    expect(screen.getByRole("button", { name: "Previous" })).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByRole("button", { name: "Next" })).toHaveAttribute("aria-disabled", "false");
  });

  it("follows a swipe through the scroll position", () => {
    renderCarousel();

    scrollTrackTo(370);

    expect(screen.getByText("2 / 4")).toBeVisible();
    expect(screen.getByRole("button", { name: "Previous" })).toHaveAttribute("aria-disabled", "false");
  });

  it("picks up a swipe made before the JavaScript arrived", () => {
    vi.spyOn(Element.prototype, "clientWidth", "get").mockReturnValue(slideWidth);
    vi.spyOn(Element.prototype, "scrollLeft", "get").mockReturnValue(370);

    renderCarousel();

    expect(screen.getByText("2 / 4")).toBeVisible();
  });

  it("turns the next arrow off on the last slide", () => {
    renderCarousel();

    scrollTrackTo(1110);

    expect(screen.getByText("4 / 4")).toBeVisible();
    expect(screen.getByRole("button", { name: "Next" })).toHaveAttribute("aria-disabled", "true");
  });

  it("scrolls one slide forward with the next arrow", async () => {
    const user = userEvent.setup();
    renderCarousel();
    scrollTrackTo(370);

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(scrollTo).toHaveBeenCalledExactlyOnceWith({ left: 740 });
  });

  it("scrolls one slide back with the previous arrow", async () => {
    const user = userEvent.setup();
    renderCarousel();
    scrollTrackTo(370);

    await user.click(screen.getByRole("button", { name: "Previous" }));

    expect(scrollTo).toHaveBeenCalledExactlyOnceWith({ left: 0 });
  });

  it("keeps the arrow focusable but idle at the end", () => {
    renderCarousel();
    scrollTrackTo(1110);
    const next = screen.getByRole("button", { name: "Next" });

    fireEvent.click(next);

    expect(next).toBeEnabled();
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("drops the controls when there is nothing to scroll to", () => {
    renderCarousel(1);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByText("1 / 1")).not.toBeInTheDocument();
  });
});
