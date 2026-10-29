import { sql } from "drizzle-orm";
import { check, index, jsonb, pgEnum, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import type { RichTextDoc } from "../../shared/lib/rich-text";
import { id, localeEnum, timestamps, translationOf } from "./common";

export const postStatusEnum = pgEnum("post_status", ["draft", "published"]);

export const posts = pgTable(
  "posts",
  {
    id: id(),
    /** One English slug for every locale. */
    slug: text().notNull().unique(),
    status: postStatusEnum().notNull().default("draft"),
    publishedAt: timestamp({ withTimezone: true }),
    /** Vercel Blob URL. Alt text is the translated title. */
    coverUrl: text(),
    ...timestamps,
  },
  (t) => [
    check("posts_published_has_date", sql`${t.status} <> 'published' or ${t.publishedAt} is not null`),
    index("posts_status_published_at_idx").on(t.status, t.publishedAt.desc()),
  ],
);

export const postTranslations = pgTable(
  "post_translations",
  {
    postId: translationOf(() => posts.id),
    locale: localeEnum().notNull(),
    title: text(),
    excerpt: jsonb().$type<RichTextDoc>(),
    body: jsonb().$type<RichTextDoc>(),
    /** Free-form tags per locale, not linked to skills. */
    tags: text().array(),
    ...timestamps,
  },
  (t) => [
    primaryKey({ columns: [t.postId, t.locale] }),
    check(
      "post_translations_en_complete",
      sql`${t.locale} <> 'en' or (${t.title} is not null and ${t.excerpt} is not null and ${t.tags} is not null)`,
    ),
  ],
);
