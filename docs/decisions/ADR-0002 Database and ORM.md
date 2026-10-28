---
tags: [adr, database]
status: accepted
date: 2026-10-26
updated: 2026-10-28
---

# ADR-0002 Database and ORM

## Context
Data should be dynamic and editable without redeploy. Vercel's filesystem is read-only at runtime, so file-based storage cannot be written. Must stay within free tiers.

## Decision
Neon Postgres provisioned through Vercel Marketplace (`vercel integration add neon`). Drizzle ORM with the `@neondatabase/serverless` HTTP driver; Drizzle Studio for ad-hoc data inspection.

**One database for everything** (amended 2026-10-28): local development, preview deployments and production all use the same Neon database. No Neon branch per environment and no branch per preview deployment.

**No migration files** (amended 2026-10-28): the schema in `src/db/schema/` is the source of truth and is synced with `drizzle-kit push`, run manually from the local machine. Nothing runs schema changes during the Vercel build.

## Alternatives
- Prisma 7: comparable now, but heavier client and a generate step; Drizzle is closer to SQL, which is better for learning.
- Supabase: brings auth/storage we do not need; we want to write auth ourselves.
- Local Postgres in Docker: diverges from production.
- Separate Neon branch for development and per preview deployment: isolates data, but adds environment juggling the owner does not want for a single-author site.
- `drizzle-kit generate` + `migrate` with committed SQL files: reviewable history of schema changes, needed for teams and multiple databases; overkill with one database and one author.

## Consequences
- Neon Free: 1 GB storage, 100 CU-hours/month, scale-to-zero after 5 min → first request after idle is slower; ISR hides this for public pages.
- Connection string via env var `DATABASE_URL`, injected by the Vercel integration into every environment and pulled locally with `vercel env pull`.
- Local dev and previews read and write production data. Test writes must be cleaned up by hand.
- `drizzle-kit push` applies changes immediately. Destructive changes (dropped or renamed columns) are confirmed interactively; read the prompt before accepting. Prefer additive changes: push the schema first, deploy code that uses it second.
- The seed script fills empty tables only and never truncates, so it cannot wipe content edited later in the admin.
