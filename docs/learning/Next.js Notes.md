---
tags: [learning, nextjs]
updated: 2026-10-28
---

# Next.js Notes

Running notes on concepts as they appear in the project. One heading per concept; link the file where it is used.

## App Router basics
- `app/` tree: folders are route segments; `page.tsx` makes a segment public, `layout.tsx` wraps children and persists across navigation.
- Server Components are the default. Client Components need `"use client"` and are the only place for hooks and browser APIs.
- `LayoutProps<"/">` in the scaffold is a generated route type (Next 16 typed routes). Types regenerate on `next dev` / `next build`.

## Caching: two models
- **Previous model** (no `cacheComponents`): Next decides per *route* at build time. One `cookies()` call or one uncached `fetch` turns the whole route dynamic. Caching knobs: `fetch(..., { cache: "force-cache", next: { revalidate } })`, `unstable_cache` for non-fetch work, segment exports `dynamic`, `revalidate`, `fetchCache`. Next 14 cached `fetch` by default; Next 15 stopped.
- **Cache Components** (`cacheComponents: true`, this project): everything is dynamic unless opted in. Opt in per function or component with `"use cache"`. At build, Partial Prerendering builds a static shell from plain markup and cached results; uncached or request-dependent work must sit inside `<Suspense>` and streams at request time (otherwise the dev overlay reports *blocking-route*).
- Directive variants: `"use cache"` (shared, no cookies/headers inside, arguments form the cache key), `"use cache: private"` (per user, may read cookies), `"use cache: remote"` (durable shared store; serverless memory does not survive between requests).
- Pair every `"use cache"` with `cacheLife`. Profiles have three numbers: **stale** (client reuses without asking), **revalidate** (server refreshes in the background), **expire** (after this, no stale value; the request waits). `max` = 5 min / 30 days / 1 year.
- Used in `src/db/queries/home.ts`: `cacheLife("max")` + `cacheTag(...)` per entity.

## ISR (Incremental Static Regeneration)
- A static page regenerated without a full rebuild, stale-while-revalidate: visitors get the cached version instantly, a fresh one is built in the background.
- History: Pages Router `getStaticProps` → `revalidate: 60` (Next 9.5); previous App Router → `export const revalidate`; Cache Components → no dedicated switch, built from `cacheLife` + `cacheTag`.
- On demand: `revalidateTag(tag, "max")` = background refresh, may serve stale once; `updateTag(tag)` = expire now, Server Actions only, for read-your-own-writes (the admin sees its edit at once); `revalidatePath(path)` when tags are unknown. Prefer tags.
- Params missing from `generateStaticParams` get the App Shell first, then the rendered result is cached.
- On Vercel the ISR cache is shared across instances and regions.

## Environment variables outside Next
- Next loads `.env*` itself; scripts (drizzle-kit, seed) do not. `@next/env` → `loadEnvConfig(process.cwd())` loads them with Next's exact order: `process.env`, `.env.$(NODE_ENV).local`, `.env.local`, `.env.$(NODE_ENV)`, `.env`.
- Used in `drizzle.config.ts` and `src/db/load-env.ts`.

## `server-only`
- `import "server-only"` makes the build fail if a client component imports the module. Guards against shipping DB code and secrets to the browser. Used in `src/db/queries/home.ts`. Not in `src/db/index.ts`, because plain Node scripts import it and the package throws outside the React Server condition.

## To write up when encountered
- Rendering modes and how Next decides static vs dynamic.
- Server Actions and `useActionState`.
- `proxy` (formerly `middleware`) and route protection.
- `generateStaticParams`, `generateMetadata`.
- Streaming with `Suspense`, `loading.tsx`, `error.tsx`, `not-found.tsx`.
