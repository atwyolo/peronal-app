import { getLocale, getTranslations } from "next-intl/server";
import type { FC } from "react";

import { getLatestPosts } from "@/db/queries/home";
import { PostCard } from "@/features/post-card/PostCard";
import { ButtonLink } from "@/shared/ui/ButtonLink";
import { Carousel } from "@/shared/ui/Carousel";
import { SectionHeader } from "@/shared/ui/SectionHeader";

/**
 * Blog block: the latest posts, the newest one featured, then the way to the full list. No post, no block.
 * The span goes on the track's first child: that is the carousel's slide, the card only fills it.
 */
export const Blog: FC = async () => {
  const locale = await getLocale();
  const [posts, t] = await Promise.all([getLatestPosts(locale), getTranslations("Home.blog")]);

  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="blog-title" className="flex flex-col gap-3 lg:gap-4">
      <SectionHeader id="blog-title">{t("label")}</SectionHeader>
      <Carousel label={t("label")} className="lg:grid-cols-4 lg:[&>:first-child]:col-span-2">
        {posts.map((post, index) => (
          <PostCard key={post.slug} post={post} featured={index === 0} />
        ))}
      </Carousel>
      <ButtonLink href="/blog" tone="primary" className="lg:self-end">
        {t("all")}
      </ButtonLink>
    </section>
  );
};
