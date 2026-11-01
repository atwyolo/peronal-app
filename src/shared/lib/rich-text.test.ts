import { describe, expect, it } from "vitest";
import { boldParagraph, bulletList, doc, paragraph, toPlainText } from "./rich-text";

describe("toPlainText", () => {
  it("joins blocks with new lines and keeps inline text together", () => {
    const value = doc(paragraph("Lead."), boldParagraph("Results:"), bulletList(["One", "Two"]));

    expect(toPlainText(value)).toBe("Lead.\nResults:\nOne\nTwo");
  });

  it("returns an empty string for an empty document", () => {
    expect(toPlainText(doc())).toBe("");
  });
});
