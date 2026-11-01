import { type FC, Fragment, type ReactNode } from "react";

import type { RichTextDoc, RichTextNode } from "@/shared/lib/rich-text";
import { cn } from "@/shared/lib/utils";

const renderChildren = (node: RichTextNode) => node.content?.map(renderNode);

const renderNode = (node: RichTextNode, index: number): ReactNode => {
  switch (node.type) {
    case "text":
      return node.marks?.some((mark) => mark.type === "bold") ? (
        <strong key={index} className="font-semibold">
          {node.text}
        </strong>
      ) : (
        <Fragment key={index}>{node.text}</Fragment>
      );
    case "paragraph":
      return <p key={index}>{renderChildren(node)}</p>;
    case "bulletList":
      return (
        <ul key={index} className="flex flex-col gap-2.5">
          {renderChildren(node)}
        </ul>
      );
    case "listItem":
      return (
        <li
          key={index}
          className="flex gap-2.5 text-foreground-soft before:mt-2 before:size-2 before:shrink-0 before:rounded-[2px] before:bg-deco lg:gap-3"
        >
          {renderChildren(node)}
        </li>
      );
    default:
      // A node added to the editor later still shows its text, just without its own styling.
      return <Fragment key={index}>{renderChildren(node)}</Fragment>;
  }
};

interface RichTextProps {
  doc: RichTextDoc;
  /** Type sizes of the block; spacing between the document's blocks comes from here. */
  className?: string;
}

/**
 * Renders a stored Tiptap document on the server, with no editor code in the bundle.
 * Elements are built by React from a known list of nodes, so stored text can never become markup.
 */
export const RichText: FC<RichTextProps> = (props) => {
  const { doc, className } = props;

  return <div className={cn("flex min-w-0 flex-col gap-3.5 lg:gap-4", className)}>{doc.content.map(renderNode)}</div>;
};
