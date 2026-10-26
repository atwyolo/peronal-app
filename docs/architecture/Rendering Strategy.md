---
tags: [architecture]
updated: 2026-10-26
---

# Rendering Strategy

Deliberately mix rendering modes so each one is learned in practice. Every page file states its mode in a one-line comment.

| Route | Mode | Why |
|---|---|---|
| `/[locale]` (home) | static | content changes rarely; built once per locale |
| `/[locale]/about` | static | same |
| `/[locale]/projects` | ISR (`revalidate`) + on-demand `revalidateTag` from admin | DB-backed, but edits are rare |
| `/[locale]/blog` | ISR | list of posts |
| `/[locale]/blog/[slug]` | static params + ISR; view counter via Server Action | post body is static, counter is a mutation |
| `/[locale]/contact` | dynamic (Server Action) | form submission |
| `/admin/**` | dynamic, no caching | authenticated, always fresh |

Notes to expand: streaming with `Suspense` on the blog list, `loading.tsx` / `error.tsx` per segment, `unstable_cache` vs `fetch` caching in Next 16 (check `node_modules/next/dist/docs/` before relying on memory).

Related: [[ADR-0001 Framework and Rendering]], [[Next.js Notes]]
