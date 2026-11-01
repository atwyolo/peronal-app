import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boldParagraph, bulletList, doc, paragraph } from "@/shared/lib/rich-text";
import { RichText } from "./RichText";

describe("RichText", () => {
  it("renders paragraphs in document order", () => {
    const { container } = render(<RichText doc={doc(paragraph("First."), paragraph("Second."))} />);

    expect([...container.querySelectorAll("p")].map((node) => node.textContent)).toEqual(["First.", "Second."]);
  });

  it("renders bold text as strong", () => {
    render(<RichText doc={doc(boldParagraph("Results:"))} />);

    expect(screen.getByText("Results:").tagName).toBe("STRONG");
  });

  it("renders a bullet list as a real list", () => {
    render(<RichText doc={doc(bulletList(["One", "Two"]))} />);

    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual(["One", "Two"]);
  });

  it("escapes markup stored in the text", () => {
    const { container } = render(<RichText doc={doc(paragraph("<img src=x onerror=alert(1)>"))} />);

    expect(container.querySelector("img")).toBeNull();
    expect(container).toHaveTextContent("<img src=x onerror=alert(1)>");
  });

  it("keeps the text of a node it does not know", () => {
    const blockquote = { type: "blockquote", content: [paragraph("Quoted.")] };

    render(<RichText doc={doc(blockquote)} />);

    expect(screen.getByText("Quoted.")).toBeInTheDocument();
  });

  it("keeps the text under a mark it does not know", () => {
    const content = [{ type: "text", text: "Linked.", marks: [{ type: "link", attrs: { href: "https://a.b" } }] }];

    render(<RichText doc={doc({ type: "paragraph", content })} />);

    expect(screen.getByText("Linked.")).toBeInTheDocument();
  });

  it("passes className to the wrapper", () => {
    const { container } = render(<RichText doc={doc(paragraph("Text."))} className="custom" />);

    expect(container.firstElementChild).toHaveClass("custom");
  });
});
