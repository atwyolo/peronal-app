import { type AnyPgColumn, integer, pgEnum, timestamp } from "drizzle-orm/pg-core";
import { locales } from "../../lib/locales";

/** Postgres enum: the database itself rejects a locale the app does not support. */
export const localeEnum = pgEnum("locale", locales);

/** Identity column: the SQL-standard successor of `serial`. `always` forbids manual ids. */
export const id = () => integer().primaryKey().generatedAlwaysAsIdentity();

export const timestamps = {
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

/** Translation rows reference their entity and are deleted with it. */
export const translationOf = (column: () => AnyPgColumn) =>
  integer().notNull().references(column, { onDelete: "cascade" });
