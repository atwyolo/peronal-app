"use client";

import NextImage from "next/image";
import { type FC, useState } from "react";

interface ImageProps {
  /** Null renders the placeholder, e.g. a database field that is not filled yet. */
  src: string | null;
  /** Also labels the placeholder, so a screen reader announces the same thing either way. */
  alt: string;
  /** Rendered image width per breakpoint, see `sizes` in the next/image docs. */
  sizes: string;
  /** For the LCP image only. */
  preload?: boolean;
  /** Applied to the image, e.g. `object-cover`. */
  className?: string;
}

/**
 * Every image of the site: next/image in `fill` mode with a striped placeholder for a missing source or a failed load.
 * The parent sets the size and `position: relative`, so the placeholder takes exactly the image's place.
 * A client component because `onError` is a browser event; the image is still in the prerendered HTML.
 */
export const Image: FC<ImageProps> = (props) => {
  const { src, alt, sizes, preload, className } = props;
  // The failed URL rather than a flag: a new `src` gets its own chance without resetting state in an effect.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || src === failedSrc) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="absolute inset-0 bg-[repeating-linear-gradient(45deg,var(--placeholder)_0_8px,transparent_8px_16px)]"
      />
    );
  }

  return (
    <NextImage
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      preload={preload}
      className={className}
      onError={() => setFailedSrc(src)}
    />
  );
};
