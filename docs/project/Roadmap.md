---
tags: [project, roadmap]
updated: 2026-10-26
---

# Roadmap

Each stage ends with a working build and a short explanation of the Next.js concepts it introduced (captured in [[Next.js Notes]]).

- [x] **Stage 0 — Scaffold** (2026-10-26): `create-next-app`, shadcn init, lint/type/build green, docs vault, `CLAUDE.md`.
- [ ] **Stage 1 — Skeleton & theme**: root layout, navigation, placeholder routes for every section, `next-themes` dark mode, base shadcn components, metadata API.
- [ ] **Stage 2 — i18n**: `next-intl`, `[locale]` segment, 8 locales, locale switcher, `generateStaticParams` for locales, localized metadata. *In progress:* routing, proxy detection and messages done 2026-10-29 (see [[2026-10-29-home-page-design]]); metadata and switcher next.
- [ ] **Stage 3 — Database**: Neon via Vercel Marketplace, Drizzle schema with translation tables, `drizzle-kit push`, seed script, Projects page reading from DB with ISR.
- [ ] **Stage 4 — Blog**: posts + translations in DB, dynamic `[slug]` route, static params, Tiptap JSON → React renderer, view counter.
- [ ] **Stage 5 — Contact form**: Server Action, React Hook Form + Zod on the client, same schema on the server, honeypot, `useActionState`, messages table.
- [ ] **Stage 6 — Admin**: Auth.js v5 credentials login, route protection, admin layout mirroring site structure, CRUD per entity, Tiptap editor, TanStack Table lists, per-locale editing with fallback indicator.
- [ ] **Stage 7 — Deploy**: Vercel project, env vars, Neon integration (single database, no preview branches), Vercel Blob for uploads.
- [ ] **Stage 8 — Polish**: sitemap/robots, OG images, loading/error boundaries, Suspense streaming, Lighthouse pass.

Later / optional: email notification for contact messages (Resend), machine-translation helper in admin (DeepL), analytics.
