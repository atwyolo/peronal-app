import { sql } from "drizzle-orm";
import { boolean, check, index, integer, pgTable, primaryKey, smallint, text } from "drizzle-orm/pg-core";
import { id, localeEnum, timestamps, translationOf } from "./common";

export const skillDomains = pgTable("skill_domains", {
  id: id(),
  /** Stable machine key used in URLs and filters, e.g. `core`. */
  key: text().notNull().unique(),
  sort: integer().notNull().default(0),
  ...timestamps,
});

export const skillDomainTranslations = pgTable(
  "skill_domain_translations",
  {
    domainId: translationOf(() => skillDomains.id),
    locale: localeEnum().notNull(),
    label: text(),
    ...timestamps,
  },
  (t) => [
    primaryKey({ columns: [t.domainId, t.locale] }),
    check("skill_domain_translations_en_complete", sql`${t.locale} <> 'en' or ${t.label} is not null`),
  ],
);

/** Tech names are not translated, so skills have no translation table. */
export const skills = pgTable(
  "skills",
  {
    id: id(),
    name: text().notNull().unique(),
    level: smallint().notNull(),
    /** `restrict`: a domain cannot be deleted while skills still use it. */
    domainId: integer()
      .notNull()
      .references(() => skillDomains.id, { onDelete: "restrict" }),
    /** Shown as a hero chip on the home page. */
    main: boolean().notNull().default(false),
    sort: integer().notNull().default(0),
    ...timestamps,
  },
  (t) => [
    check("skills_level_range", sql`${t.level} between 1 and 10`),
    index("skills_domain_id_idx").on(t.domainId),
  ],
);
