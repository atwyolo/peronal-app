import { render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { AnchorHTMLAttributes } from "react";
import { describe, expect, it, vi } from "vitest";
import type { HomePost } from "@/db/queries/home";
import { doc, paragraph } from "@/shared/lib/rich-text";
import messages from "../../../messages/en.json";
import { PostCard } from "./PostCard";

// next-intl navigation needs the Next router.
vi.mock("@/shared/lib/i18n/navigation", () => ({
  Link: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} />,
}));

const post: HomePost = {
  slug: "offline-mode-in-react",
  publishedAt: "2026-10-12T00:00:00.000Z",
  coverUrl: null,
  topic: "Technical",
  title: "Offline mode in a React app",
  excerpt: doc(paragraph("A service worker is only half the story.")),
  tags: ["React", "PWA"],
};

const renderCard = (overrides: Partial<HomePost> = {}, featured?: boolean) =>
  render(
    <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
      <PostCard post={{ ...post, ...overrides }} featured={featured} />
    </NextIntlClientProvider>,
  );

describe("PostCard", () => {
  it("shows the topic before the date", () => {
    renderCard();

    const topic = screen.getByText("Technical");
    const date = screen.getByText("Oct 12, 2026");

    expect(topic.compareDocumentPosition(date) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("gives the date its machine-readable value", () => {
    renderCard();

    expect(screen.getByText("Oct 12, 2026").closest("time")).toHaveAttribute("dateTime", post.publishedAt);
  });

  // 23:30 UTC is already the next day east of Greenwich and 00:30 is the previous one west of it.
  it.each([
    ["2026-10-12T23:30:00.000Z", "Oct 12, 2026"],
    ["2026-10-12T00:30:00.000Z", "Oct 12, 2026"],
  ])("prints the UTC day of %s whatever the machine's zone", (publishedAt, printed) => {
    renderCard({ publishedAt });

    expect(screen.getByText(printed)).toBeVisible();
  });

  it("shows the title as a third-level heading and the excerpt as plain text", () => {
    renderCard();

    expect(screen.getByRole("heading", { level: 3, name: post.title })).toBeVisible();
    expect(screen.getByText("A service worker is only half the story.")).toBeVisible();
  });

  it("lists the tags", () => {
    renderCard();

    const tags = within(screen.getByRole("list")).getAllByRole("listitem");

    expect(tags.map((tag) => tag.textContent)).toEqual(["React", "PWA"]);
  });

  it("has no empty tag list", () => {
    renderCard({ tags: [] });

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("leads to the post", () => {
    renderCard();

    expect(screen.getByRole("link", { name: "Read more" })).toHaveAttribute("href", "/blog/offline-mode-in-react");
  });

  it("has no cover unless it is featured", () => {
    renderCard({ coverUrl: "https://example.com/cover.jpg" });

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("shows a featured post's cover, described by the title", () => {
    renderCard({ coverUrl: "https://example.com/cover.jpg" }, true);

    expect(screen.getByRole("img", { name: post.title }).tagName).toBe("IMG");
  });

  it("shows a placeholder when a featured post has no cover", () => {
    renderCard({}, true);

    expect(screen.getByRole("img", { name: post.title }).tagName).toBe("DIV");
  });
});
