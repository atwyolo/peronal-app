import { useFormatter, useTranslations } from "next-intl";
import type { FC } from "react";

import type { HomePost } from "@/db/queries/home";
import { toPlainText } from "@/shared/lib/rich-text";
import { cn } from "@/shared/lib/utils";
import { Chip } from "@/shared/ui/Chip";
import { Image } from "@/shared/ui/Image";
import { Link } from "@/shared/ui/Link";
import { Tile } from "@/shared/ui/Tile";

interface PostCardProps {
  post: HomePost;
  /** The latest post: a larger title and a cover, on top below `lg`, on the left from `lg`. */
  featured?: boolean;
  className?: string;
}

/**
 * One post: topic, date, title, excerpt, tags. Synchronous, so Vitest can render it.
 * The cover's box is 220px wide from `lg` but at least 240px tall, so `object-cover` scales a landscape file by the
 * height: `sizes` asks for twice the box width.
 */
export const PostCard: FC<PostCardProps> = (props) => {
  const { post, featured, className } = props;
  const { slug, publishedAt, coverUrl, topic, title, excerpt, tags } = post;
  const t = useTranslations("Home.blog");
  const format = useFormatter();

  return (
    <Tile
      as="article"
      className={cn(featured ? "gap-2.5 p-3 lg:flex-row lg:gap-5 lg:p-3.5" : "p-4.5 lg:p-5", className)}
    >
      {featured && (
        <div className="relative h-37.5 shrink-0 lg:h-auto lg:min-h-60 lg:w-55">
          <Image
            src={coverUrl}
            alt={title}
            sizes="(min-width: 1024px) 440px, (min-width: 720px) 662px, calc(100vw - 58px)"
            className="object-cover"
            framed
          />
        </div>
      )}
      <div
        className={cn(
          "flex min-w-0 grow flex-col gap-2 lg:gap-2.5",
          featured && "px-1 pt-1 pb-0.5 lg:pt-2 lg:pr-2 lg:pb-1.5 lg:pl-0",
        )}
      >
        <p className="flex flex-wrap items-center gap-2.5">
          <span className="rounded-[6px] bg-brand/14 px-2 py-[5px] font-mono text-[11px] leading-none font-semibold tracking-[0.08em] text-brand uppercase">
            {topic}
          </span>
          <time
            dateTime={publishedAt}
            className="font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase lg:text-xs"
          >
            {format.dateTime(new Date(publishedAt), { year: "numeric", month: "short", day: "numeric" })}
          </time>
        </p>
        <h3
          className={cn(
            "font-bold",
            // `leading` after `text`: `cn` treats a later font size as overriding the line height and drops it.
            featured
              ? "text-[19px] leading-[1.3] lg:text-[22px] lg:leading-tight lg:tracking-[-0.01em]"
              : "text-[17px] leading-[1.3] lg:text-lg",
          )}
        >
          {title}
        </h3>
        <p className="text-[15px] leading-[1.55] whitespace-pre-line text-foreground-soft">{toPlainText(excerpt)}</p>
        {tags.length > 0 && (
          <ul className="mt-0.5 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <li key={tag}>
                <Chip>{tag}</Chip>
              </li>
            ))}
          </ul>
        )}
        <Link href={`/blog/${slug}`} showArrowIcon className="mt-auto self-start py-1 text-[15px]">
          {t("readMore")}
        </Link>
      </div>
    </Tile>
  );
};
