---
tags: [learning, nextjs]
updated: 2026-10-26
---

# Next.js Notes

Running notes on concepts as they appear in the project. One heading per concept; link the file where it is used.

## App Router basics
- `app/` tree: folders are route segments; `page.tsx` makes a segment public, `layout.tsx` wraps children and persists across navigation.
- Server Components are the default. Client Components need `"use client"` and are the only place for hooks and browser APIs.
- `LayoutProps<"/">` in the scaffold is a generated route type (Next 16 typed routes). Types regenerate on `next dev` / `next build`.

## To write up when encountered
- Rendering modes and how Next decides static vs dynamic.
- Caching in Next 16 (`fetch`, `unstable_cache`, `revalidateTag`, `revalidatePath`).
- Server Actions and `useActionState`.
- `proxy` (formerly `middleware`) and route protection.
- `generateStaticParams`, `generateMetadata`.
- Streaming with `Suspense`, `loading.tsx`, `error.tsx`, `not-found.tsx`.
