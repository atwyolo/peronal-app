---
tags: [architecture]
updated: 2026-10-28
---

# Rendering Strategy

Deliberately mix rendering modes so each one is learned in practice. Every page file states its mode in a one-line comment.

| Route | Mode | Why |
|---|---|---|
| `/[locale]` (home) | static, DB-backed: `"use cache"` + `cacheLife("max")` + `cacheTag` per entity; admin calls `updateTag` | content changes rarely; built once per locale, refreshed only when edited |
| `/[locale]/about` | static | same |
| `/[locale]/projects` | ISR (`revalidate`) + on-demand `revalidateTag` from admin | DB-backed, but edits are rare |
| `/[locale]/blog` | ISR | list of posts |
| `/[locale]/blog/[slug]` | static params + ISR; view counter via Server Action | post body is static, counter is a mutation |
| `/[locale]/contact` | dynamic (Server Action) | form submission |
| `/admin/**` | dynamic, no caching | authenticated, always fresh |

The project runs with `cacheComponents: true`, so "ISR" means cached functions with tags, not a route-level `revalidate` export.

Notes to expand: streaming with `Suspense` on the blog list, `loading.tsx` / `error.tsx` per segment.

Related: [[ADR-0001 Framework and Rendering]]
