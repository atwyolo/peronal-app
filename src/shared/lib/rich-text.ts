/**
 * Rich text is stored as Tiptap (ProseMirror) JSON. These types mirror Tiptap's `JSONContent`
 * so the database layer does not depend on the editor package, which arrives with the admin (Stage 6).
 */
export type RichTextMark = {
  type: string;
  attrs?: Record<string, unknown>;
};

export type RichTextNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: RichTextNode[];
  marks?: RichTextMark[];
  text?: string;
};

export type RichTextDoc = {
  type: "doc";
  content: RichTextNode[];
};

const text = (value: string): RichTextNode => ({ type: "text", text: value });

export const paragraph = (value: string): RichTextNode => ({
  type: "paragraph",
  content: [text(value)],
});

export const boldParagraph = (value: string): RichTextNode => ({
  type: "paragraph",
  content: [{ ...text(value), marks: [{ type: "bold" }] }],
});

export const bulletList = (items: string[]): RichTextNode => ({
  type: "bulletList",
  content: items.map((item) => ({ type: "listItem", content: [paragraph(item)] })),
});

export const doc = (...content: RichTextNode[]): RichTextDoc => ({ type: "doc", content });

/** Flattens a document to plain text: for temporary output, meta descriptions and search. */
export function toPlainText(node: RichTextDoc | RichTextNode): string {
  if ("text" in node && node.text) return node.text;
  const parts = (node.content ?? []).map(toPlainText);
  const isBlock = node.type === "doc" || node.type === "bulletList";
  return parts.join(isBlock ? "\n" : "");
}
