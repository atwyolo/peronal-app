---
tags: [adr, database]
status: accepted
date: 2026-10-26
---

# ADR-0002 Database and ORM

## Context
Data should be dynamic and editable without redeploy. Vercel's filesystem is read-only at runtime, so file-based storage cannot be written. Must stay within free tiers.

## Decision
Neon Postgres provisioned through Vercel Marketplace (`vercel install neon`). Drizzle ORM with the `@neondatabase/serverless` HTTP driver; `drizzle-kit` for migrations; Drizzle Studio for ad-hoc data inspection. Local development uses a dedicated Neon branch.

## Alternatives
- Prisma 7: comparable now, but heavier client and a generate step; Drizzle is closer to SQL, which is better for learning.
- Supabase: brings auth/storage we do not need; we want to write auth ourselves.
- Local Postgres in Docker: diverges from production; Neon branches are free (10 per project).

## Consequences
- Neon Free: 1 GB storage, 100 CU-hours/month, scale-to-zero after 5 min → first request after idle is slower; ISR hides this for public pages.
- Connection string via env var `DATABASE_URL`, injected by Vercel integration.
