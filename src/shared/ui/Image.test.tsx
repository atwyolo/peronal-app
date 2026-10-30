import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Image } from "./Image";

const src = "https://example.com/photo.jpg";

describe("Image", () => {
  it("renders the image with its alt text", () => {
    render(<Image src={src} alt="Photo" sizes="100vw" />);

    expect(screen.getByRole("img", { name: "Photo" }).tagName).toBe("IMG");
  });

  it("shows a labelled placeholder when there is no source", () => {
    render(<Image src={null} alt="Photo" sizes="100vw" />);

    expect(screen.getByRole("img", { name: "Photo" }).tagName).toBe("DIV");
  });

  it("replaces the image with the placeholder when it fails to load", () => {
    render(<Image src={src} alt="Photo" sizes="100vw" />);

    fireEvent.error(screen.getByRole("img", { name: "Photo" }));

    expect(screen.getByRole("img", { name: "Photo" }).tagName).toBe("DIV");
  });

  it("tries again when the source changes after a failure", () => {
    const { rerender } = render(<Image src={src} alt="Photo" sizes="100vw" />);
    fireEvent.error(screen.getByRole("img", { name: "Photo" }));

    rerender(<Image src="https://example.com/new.jpg" alt="Photo" sizes="100vw" />);

    expect(screen.getByRole("img", { name: "Photo" }).tagName).toBe("IMG");
  });
});
