import { render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes } from "react";
import { describe, expect, it, vi } from "vitest";
import { Link } from "./Link";

// next-intl navigation needs the Next router; the marker tells the router link from a plain anchor.
vi.mock("@/shared/lib/i18n/navigation", () => ({
  Link: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => <a data-router-link {...props} />,
}));

describe("Link", () => {
  it.each(["/about", "/about#glovo", "#contacts"])("sends the internal %s through the router", (href) => {
    render(<Link href={href}>Text</Link>);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("data-router-link");
    expect(link).toHaveAttribute("href", href);
    expect(link).not.toHaveAttribute("target");
  });

  it.each(["https://github.com/a", "HTTP://example.com", "//example.com/a"])(
    "renders %s as a plain anchor in a new tab",
    (href) => {
      render(<Link href={href}>Text</Link>);

      const link = screen.getByRole("link");
      expect(link).not.toHaveAttribute("data-router-link");
      expect(link).toHaveAttribute("href", href);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    },
  );

  it.each(["mailto:a@b.c", "tel:+15551234567"])("renders %s as a plain anchor in the same tab", (href) => {
    render(<Link href={href}>Text</Link>);

    const link = screen.getByRole("link");
    expect(link).not.toHaveAttribute("data-router-link");
    expect(link).not.toHaveAttribute("target");
  });

  it("lets the caller open an external link in the same tab", () => {
    render(
      <Link href="https://example.com/cv.pdf" target={undefined} rel={undefined}>
        Text
      </Link>,
    );

    expect(screen.getByRole("link")).not.toHaveAttribute("target");
  });

  it("shows no arrow by default", () => {
    render(<Link href="/about">Text</Link>);

    expect(screen.getByRole("link")).toHaveTextContent(/^Text$/);
  });

  it("shows an arrow on request, kept out of the accessible name", () => {
    render(
      <Link href="/about" showArrowIcon>
        Read more
      </Link>,
    );

    expect(screen.getByRole("link", { name: "Read more" })).toHaveTextContent("Read more →");
  });

  it("shows the arrow on an external link too", () => {
    render(
      <Link href="https://example.com" showArrowIcon>
        Read more
      </Link>,
    );

    expect(screen.getByRole("link", { name: "Read more" })).toHaveTextContent("Read more →");
  });

  it("passes className and other anchor props", () => {
    render(
      <Link href="/about" className="self-start" aria-label="About me">
        Text
      </Link>,
    );

    expect(screen.getByRole("link", { name: "About me" })).toHaveClass("self-start");
  });
});
