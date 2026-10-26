# CLAUDE.md — project rules for `personal`

Personal portfolio site. Primary goal besides shipping: the owner is learning Next.js fundamentals along the way, so every step should come with a short "why it is built this way" explanation.

## Language

- Everything inside this repository is written in **English**: code, comments, commit messages, docs in `docs/`, UI copy source strings.
- Conversation with the owner happens in Russian (global rule). Never mix the two: no Russian in files, no English chat.

## Stack (decided, do not re-litigate)

- Next.js 16 App Router, React 19, TypeScript strict, `src/` layout, `@/*` alias, npm.
- Styling: Tailwind v4 + shadcn/ui (Base UI, style `base-nova`). Components live in `src/components/ui` and are owned code.
- Data: Neon Postgres via Vercel Marketplace, Drizzle ORM with `@neondatabase/serverless` (HTTP driver). Local dev uses a separate Neon branch.
- i18n: `next-intl` for UI strings. DB content is localized through **translation tables** (`<entity>_translations` with `locale` column), never jsonb. Locales: `en` (default, fallback), `ru`, `pt`, `es`, `de`, `fr`, `ja`, `pl`.
- Forms: React Hook Form + Zod (`zodResolver`). Zod schemas are the single source of validation on both client and server.
- Admin: hand-written under `/admin`. Auth.js v5 credentials login, routes protected in proxy. Rich text: Tiptap 3, stored as JSON, rendered server-side on the public site.
- Theme: `next-themes`, class strategy, respects system preference.
- Hosting: Vercel Hobby. Filesystem is read-only at runtime; uploads go to Vercel Blob.

## Before writing code

- Read the matching guide in `node_modules/next/dist/docs/` first. Next 16 APIs differ from older versions (see `AGENTS.md`).
- Discuss approach and alternatives before implementing anything non-trivial (global rule). Confirm, then code.
- Check `docs/Home.md` for the current roadmap, decisions (ADRs) and open questions. Update them when a decision changes.

## Conventions

- Server Components by default. Add `"use client"` only where hooks, browser APIs or event handlers are required, and keep those leaves small.
- Data access goes through `src/db/` (schema, queries). Pages never import the driver directly.
- Mutations are Server Actions in `src/actions/`, validated with Zod, returning typed `{ ok, errors }` results for `useActionState`.
- Rendering intent is explicit per route: static, ISR (`revalidate`), or dynamic. Note it in a one-line comment at the top of the page file.
- Commits: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`). The owner manages git; do not commit or push unless asked. Never put Claude session links into commits, PRs or issues.

## Commands

```bash
npm run dev      # dev server (Turbopack)
npm run build    # production build, also runs type check
npm run lint     # eslint
npx tsc --noEmit # standalone type check
```

## Docs vault

`docs/` is an Obsidian-style vault: Markdown with `[[wikilinks]]`, YAML frontmatter, one topic per note. Entry point is `docs/Home.md`. Record architectural decisions as ADRs in `docs/decisions/`, session summaries in `docs/journal/`, learning notes in `docs/learning/`.
