import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set. Run `npx vercel env pull .env.local`.");
}

/**
 * Neon HTTP driver: every query is one HTTPS request, no connection pool to manage.
 * That suits serverless functions, which start cold and die between requests.
 * `casing: "snake_case"` maps camelCase keys in TS to snake_case columns in SQL.
 */
export const db = drizzle(url, { schema, casing: "snake_case" });
