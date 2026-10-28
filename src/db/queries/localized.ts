import { type SQL, sql } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";

type ColumnData<T extends AnyPgColumn> = T["_"]["data"];

/**
 * Per-field locale fallback: the requested translation if set, otherwise English.
 * `requested` and `en` are two aliases of the same translation table; the result type comes from `en`.
 * `mapWith(en)` reuses the column's own decoder, so jsonb comes back as an object, not a string.
 *
 * Use for fields the `<entity>_translations_en_complete` check constraint makes required in `en`:
 * the English row always has them, so the result is never null.
 */
export function localized<T extends AnyPgColumn>(requested: AnyPgColumn, en: T): SQL<ColumnData<T>> {
  return sql`coalesce(${requested}, ${en})`.mapWith(en) as SQL<ColumnData<T>>;
}

/** Same fallback for fields that may be empty even in English (e.g. `cv_url`). */
export function localizedOptional<T extends AnyPgColumn>(
  requested: AnyPgColumn,
  en: T,
): SQL<ColumnData<T> | null> {
  return sql`coalesce(${requested}, ${en})`.mapWith(en) as SQL<ColumnData<T> | null>;
}
